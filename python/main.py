# 실행 명령 : uvicorn main:app --reload --port=5000
# ------------------------------------
# < 설치 > 
# --huggingface 관련--
# 1. pip install transformers datasets evaluate accelerate
# --FastAPI 관련--
# 2. pip install fastapi

# ----------------------------------
# < 설치 안해도 됨 > 
# --huggingface 관련--
# 1. pip install transformers datasets evaluate accelerate
# 2. pip install tensorflow  
# 3. pip install tf-keras   
# --이미지 관련--
# 4. pip install Pillow
# --FastAPI 관련--
# 5. pip install fastapi
# --requests-- 
# 6. pip install requests
# --pandas--
# 7. pip install pandas

from PIL import Image
import io
import os
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.encoders import jsonable_encoder

from transformers import pipeline
import time
import json
import requests
import uuid
import pandas as pd
from typing import Dict, Any

from dotenv import load_dotenv
load_dotenv()

secret_key = os.getenv('NAVER_SECRET_KEY')
api_url = os.getenv('NAVER_API_URL')

classifier = pipeline("zero-shot-classification",
                     model="sileod/deberta-v3-base-tasksource-nli")


# classifier = pipeline("zero-shot-classification", 
#                       model="MoritzLaurer/mDeBERTa-v3-base-mnli-xnli")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/")
#async def root():
def root():
    return {"message": "Hello World"}


@app.get("/home")
def home():
    return {"message": "home"}

sequence_to_cls = '''
안녕하세요, 저는 현재 자녀의 교육비로 인해 예산이 많이 부족한 상황입니다. 우리 가정에서는 자녀들의 교육을 위해 최선을 다하고 있지만, 높아지는 교육비로 인해 매달 경제적으로 부담스럽습니다. 현재까지 몇 가지 방법을 시도해 보았지만, 더 효율적으로 비용을 줄일 수 있는 다양한 방법에 대해 관심이 있습니다.

우선, 공공 교육의 장점을 들어 주신 분들이 계시는데, 실제로 어떤 점이 좋았는지 자세히 알고 싶습니다. 또한, 사립 학교나 특정 교육 프로그램에 대한 경험도 함께 공유해 주시면 감사하겠습니다. 저희 가정처럼 교육비로 인해 경제적인 고민을 하고 계신 분들의 경험담도 많은 도움이 될 것 같습니다.

또한, 교육비를 줄이기 위해 다른 가정에서 성공적으로 시도한 예산 관리나 절약 방법에 대해서도 궁금합니다. 예를 들어, 교육 자재를 저렴하게 구입하는 팁이나 교외 활동을 효과적으로 관리하는 방법 등을 공유해 주시면 매우 감사하겠습니다.

마지막으로, 자녀의 교육에 있어서 절대 절약할 수 없는 부분이나 중요성을 공유해 주시면 더욱 도움이 될 것입니다. 저와 같은 부모들이 교육비 문제에 대해 더 나은 결정을 내릴 수 있도록 도와 주시면 감사하겠습니다.
'''
candidate_labels = ["광고", '부정', '소비', '저축', '수입', '기타']

@app.get("/zeroshot")
def home():
    start_time = time.time()
    result = classifier(sequence_to_cls, candidate_labels = candidate_labels)
    end_time = time.time()

    execution_time = end_time - start_time
    print(f"실행 시간: {execution_time} 초")
    print(dict(zip(result['labels'],result['scores'])))
    
class TopicSection(BaseModel):
    topic: str
    section: str
    # input_link: str
    
@app.post("/receive_post")
async def receive_text(topic_section: TopicSection):
    print("post 함수에 들어왔어요~")
    topic = topic_section.topic
    section = topic_section.section
    print(topic)
    print(section)
    print(f"Received Topic: {topic}")
    print(f"Received Section: {section}")
    
    start_time = time.time()
    result = classifier(section, candidate_labels = candidate_labels)
    end_time = time.time()

    execution_time = end_time - start_time
    print(f"실행 시간: {execution_time} 초")
    print(dict(zip(result['labels'],result['scores'])))
    subject = compare_values(dict(zip(result['labels'],result['scores'])))
    
    return {"message": "Text received successfully", "subject": subject}



def compare_values(data):
    sorted_values = sorted(data.values(), reverse=True)
    
    max_value = sorted_values[0]
    
    second_max_value = sorted_values[1] if len(sorted_values) > 1 else 0
    
    threshold = 0.18  
    
    if max_value - second_max_value >= threshold:
        for key, value in data.items():
            if value == max_value:
                return key
    else:
        return '기타'
        
        
# 이미지를 저장할 디렉토리 경로
upload_folder = "./uploaded_images"
if not os.path.exists(upload_folder):
    os.makedirs(upload_folder)


@app.post("/receive_receipt")
async def receive_receipt(file: UploadFile = File(...)):
    print("receipt 함수로 들어왔습니다.")  # 이 부분이 출력될 것입니다.
    try:
        # 이미지를 Pillow를 사용하여 열기
        img = Image.open(io.BytesIO(await file.read()))
        
        # 이미지 파일 이름 생성
        file_name = file.filename
        file_path = os.path.join(upload_folder, file_name)

        # 이미지를 지정된 경로에 저장
        img.save(file_path, format='JPEG')

        # 저장된 이미지의 경로 반환
        image_url = f"./uploaded_images/{file_name}"
        
        rusult_receipt_json = send_image_to_ocr(image_url, api_url, secret_key)
        # final_receipt_data = process_receipt_data(rusult_receipt_json, 'test')
        final_receipt_data = parse_receipt(rusult_receipt_json, 'test')
        print(final_receipt_data)
        
        # 이미지 파일 삭제
        if os.path.exists(image_url):
            os.remove(image_url)
        else:
            print(f"File {image_url} not found for deletion.")

        return final_receipt_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    
    
    
def send_image_to_ocr(image_file, api_url, secret_key):
    try:
        # Prepare JSON payload
        request_json = {
            'images': [
                {
                    'format': 'jpg',
                    'name': 'receipt'
                }
            ],
            'requestId': str(uuid.uuid4()),
            'version': 'V2',
            'timestamp': int(round(time.time() * 1000))
        }

        payload = {'message': json.dumps(request_json).encode('UTF-8')}
        
        # Prepare files for POST request
        files = [('file', open(image_file, 'rb'))]

        # Prepare headers
        headers = {
            'X-OCR-SECRET': secret_key
        }

        # Send POST request to OCR API
        response = requests.request("POST", api_url, headers=headers, data = payload, files = files)
        response.raise_for_status()  # Raise an exception for 4XX or 5XX errors

        # Parse JSON response
        json_data = response.json()
        
        return json_data

    except requests.exceptions.RequestException as e:
        print(f"Error sending image to OCR API: {e}")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None
    
    
def process_receipt_data(data, output_filename):
    # Extracting desired information
    store_name = data['images'][0]['receipt']['result']['storeInfo']['name']['formatted']['value']
    store_address = data['images'][0]['receipt']['result']['storeInfo']['addresses'][0]['formatted']['value']
    store_tel = data['images'][0]['receipt']['result']['storeInfo']['tel'][0]['formatted']['value']

    items = []
    for item in data['images'][0]['receipt']['result']['subResults'][0]['items']:
        item_name = item['name']['formatted']['value']
        item_count = item['count']['formatted']['value']
        item_unit_price = item['price']['unitPrice']['formatted']['value']
        item_total_price = item['price']['price']['formatted']['value']
        items.append({
            'itemName': item_name,
            'itemCount': item_count,
            'itemUnitPrice': item_unit_price,
            'itemTotalPrice': item_total_price
        })

    total_price = data['images'][0]['receipt']['result']['totalPrice']['price']['formatted']['value']

    # Creating JSON object
    output_data = {
        'storeName': store_name,
        'storeAddress': store_address,
        'storeTel': store_tel,
        'items': items,
        'totalPrice': total_price
    }

    # Writing to JSON file
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=4)

    print(f"JSON 파일 '{output_filename}'이 생성되었습니다.")

    return output_data







def parse_receipt(receipt_json, output_filename):
    data = receipt_json
    
    # 변수 초기화
    store_name = ""
    store_address = []
    store_tel = []
    items = []
    total_price = ""
    tax_price = ""
    
    # 이미지 데이터에서 영수증 정보 추출
    if "images" in data and data["images"]:
        # 이미지 내의 첫 번째 요소에서 영수증 결과를 가져옵니다.
        receipt_info = data["images"][0].get("receipt", {}).get("result", {})
        
        # 공통 데이터 추출
        store_info = receipt_info.get("storeInfo", {})
        
        # 사업자 번호
        if "bizNum" in store_info:
            business_number = store_info["bizNum"].get("text", "")
        
        # 가게 이름
        if "name" in store_info:
            store_name = store_info["name"].get("text", "")
        
        # 지점명 (Sub Name)
        if "subName" in store_info:
            sub_name = store_info["subName"].get("text", "")
        
        # 주소
        if "addresses" in store_info:
            store_address = [address.get("text", "") for address in store_info["addresses"]]
        
        # 전화번호
        if "tel" in store_info:
            store_tel = [tel.get("text", "") for tel in store_info["tel"]]
        
        # 결제 정보
        payment_info = receipt_info.get("paymentInfo", {})
        
        if "date" in payment_info:
            payment_date = payment_info["date"].get("text", "")
        
        if "time" in payment_info:
            payment_time = payment_info["time"].get("text", "")
        
        # 카드 정보 (존재할 경우)
        card_info = payment_info.get("cardInfo", {})
        if "company" in card_info:
            card_company = card_info["company"].get("text", "")
        if "number" in card_info:
            card_number = card_info["number"].get("text", "")
        
        # 승인 번호
        if "confirmNum" in payment_info:
            confirmation_number = payment_info["confirmNum"].get("text", "")
        
        # 상품 정보
        sub_results = receipt_info.get("subResults", [])
        for sub_result in sub_results:
            for item in sub_result.get("items", []):
                product_info = {
                    "product_name": item.get("name", {}).get("text", ""),
                    "count": item.get("count", {}).get("text", ""),
                    "unit_price": item.get("price", {}).get("unitPrice", {}).get("text", ""),
                    "total_price": item.get("price", {}).get("price", {}).get("text", "")
                }
                items.append(product_info)
        
        # 총 가격
        if "totalPrice" in receipt_info:
            total_price_info = receipt_info["totalPrice"].get("price", {})
            total_price = total_price_info.get("text", "")
        
        # 부가세 정보
        sub_total = receipt_info.get("subTotal", [])
        if sub_total and "taxPrice" in sub_total[0]:
            tax_price_info = sub_total[0]["taxPrice"][0]
            tax_price = tax_price_info.get("text", "")
    
    # Creating JSON object
    output_data = {
        'storeName': store_name,
        'storeAddress': store_address,
        'storeTel': store_tel,
        'items': items,
        'totalPrice': total_price,
        'taxPrice': tax_price
    }
    
    # Writing to JSON file
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=4)

    print(f"JSON 파일 '{output_filename}'이 생성되었습니다.")
    
    
    # 결과를 JSON 문자열로 변환하여 반환
    return output_data
