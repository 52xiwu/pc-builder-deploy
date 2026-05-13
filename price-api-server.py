#!/usr/bin/env python3
"""
PC硬件价格同步API服务
混合方案：后端Python API + 前端JavaScript调用
"""

import os
import sys
import json
import time
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# 添加技能目录到Python路径
skill_dir = "/root/.openclaw/workspace/skills/ecommerce-price-comparison"
sys.path.append(skill_dir)

# 导入技能模块
try:
    from scripts.jd_scraper import JDScraper, ProductInfo
    logger.info("✅ 成功导入电商价格比较技能")
except ImportError as e:
    logger.error(f"❌ 导入技能失败: {e}")
    # 创建模拟类以便测试
    class ProductInfo:
        def __init__(self, **kwargs):
            self.__dict__.update(kwargs)
    
    class JDScraper:
        def search(self, keyword, page=1, sort='default'):
            return []

@dataclass
class HardwareProduct:
    """硬件产品数据结构"""
    id: str
    name: str
    category: str
    specs: str
    base_price: float
    price_sources: Dict[str, float]  # 平台 -> 价格
    last_updated: str
    best_price: Dict[str, Any]
    
    def __post_init__(self):
        if not self.last_updated:
            self.last_updated = datetime.now().isoformat()
        if not self.best_price:
            self.calculate_best_price()
    
    def calculate_best_price(self):
        """计算最佳价格"""
        if not self.price_sources:
            self.best_price = {
                "platform": "暂无数据",
                "price": self.base_price,
                "saving": 0,
                "reliability": "低"
            }
            return
        
        # 找到最低价格
        min_price = min(self.price_sources.values())
        min_platform = min(self.price_sources, key=self.price_sources.get)
        
        self.best_price = {
            "platform": min_platform,
            "price": min_price,
            "saving": self.base_price - min_price,
            "reliability": self.get_reliability(min_platform),
            "timestamp": self.last_updated
        }
    
    def get_reliability(self, platform: str) -> str:
        """获取平台可靠性评级"""
        reliability_map = {
            "京东": "高",
            "淘宝": "中",
            "天猫": "高",
            "拼多多": "中",
            "中关村在线": "高",
            "什么值得买": "中"
        }
        return reliability_map.get(platform, "中")

class PriceDatabase:
    """价格数据库管理"""
    
    def __init__(self):
        self.products: Dict[str, HardwareProduct] = {}
        self.scrapers = {
            "jd": JDScraper() if 'JDScraper' in globals() else None
        }
        self.cache_file = "/tmp/hardware_price_cache.json"
        self.load_cache()
    
    def load_cache(self):
        """加载缓存数据"""
        try:
            if os.path.exists(self.cache_file):
                with open(self.cache_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    for product_id, product_data in data.items():
                        self.products[product_id] = HardwareProduct(**product_data)
                logger.info(f"✅ 从缓存加载了 {len(self.products)} 个产品")
        except Exception as e:
            logger.error(f"❌ 加载缓存失败: {e}")
    
    def save_cache(self):
        """保存缓存数据"""
        try:
            data = {pid: asdict(product) for pid, product in self.products.items()}
            with open(self.cache_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            logger.info(f"✅ 缓存保存了 {len(self.products)} 个产品")
        except Exception as e:
            logger.error(f"❌ 保存缓存失败: {e}")
    
    def initialize_hardware_products(self):
        """初始化硬件产品数据"""
        hardware_list = [
            {
                "id": "cpu_amd_ryzen9_9850x3d",
                "name": "AMD Ryzen 9 9850X3D",
                "category": "cpu",
                "specs": "24核心/48线程 4.5-6.0GHz 3D V-Cache",
                "base_price": 6999.0
            },
            {
                "id": "gpu_nvidia_rtx_5090",
                "name": "NVIDIA RTX 5090",
                "category": "gpu",
                "specs": "32GB GDDR7 旗舰显卡",
                "base_price": 19999.0
            },
            {
                "id": "mb_rog_z890_extreme",
                "name": "ROG MAXIMUS Z890 EXTREME",
                "category": "motherboard",
                "specs": "Z890芯片组 DDR5 8000+",
                "base_price": 8999.0
            },
            {
                "id": "ram_gskill_trident_z5_8000",
                "name": "G.SKILL Trident Z5 RGB 8000",
                "category": "ram",
                "specs": "32GB (2x16GB) DDR5 8000",
                "base_price": 3999.0
            },
            {
                "id": "cpu_intel_i9_14900k",
                "name": "Intel Core i9-14900K",
                "category": "cpu",
                "specs": "24核心/32线程 3.2-6.0GHz",
                "base_price": 4299.0
            },
            {
                "id": "gpu_rtx_4080_super",
                "name": "NVIDIA RTX 4080 SUPER",
                "category": "gpu",
                "specs": "16GB GDDR6X DLSS 3",
                "base_price": 8999.0
            },
            {
                "id": "mb_rog_z790_hero",
                "name": "ROG MAXIMUS Z790 HERO",
                "category": "motherboard",
                "specs": "Z790芯片组 WiFi7",
                "base_price": 4999.0
            },
            {
                "id": "ram_corsair_vengeance_6000",
                "name": "Corsair Vengeance RGB 6000",
                "category": "ram",
                "specs": "32GB (2x16GB) DDR5 6000",
                "base_price": 1015.0
            }
        ]
        
        for hw in hardware_list:
            product = HardwareProduct(
                id=hw["id"],
                name=hw["name"],
                category=hw["category"],
                specs=hw["specs"],
                base_price=hw["base_price"],
                price_sources={},
                last_updated="",
                best_price={}
            )
            self.products[hw["id"]] = product
        
        logger.info(f"✅ 初始化了 {len(self.products)} 个硬件产品")
        self.save_cache()
    
    def simulate_price_sync(self, product_id: str) -> Dict[str, float]:
        """模拟价格同步（实际项目中会调用真实API）"""
        product = self.products.get(product_id)
        if not product:
            return {}
        
        # 模拟从不同平台获取价格
        import random
        base_price = product.base_price
        
        price_sources = {
            "京东": round(base_price * (0.95 + random.random() * 0.1), 2),
            "淘宝": round(base_price * (0.93 + random.random() * 0.12), 2),
            "天猫": round(base_price * (0.96 + random.random() * 0.08), 2),
            "拼多多": round(base_price * (0.90 + random.random() * 0.15), 2),
            "中关村在线": round(base_price * (0.97 + random.random() * 0.06), 2)
        }
        
        return price_sources
    
    def sync_product_price(self, product_id: str) -> bool:
        """同步单个产品价格"""
        try:
            product = self.products.get(product_id)
            if not product:
                logger.error(f"❌ 产品不存在: {product_id}")
                return False
            
            # 获取价格数据
            price_sources = self.simulate_price_sync(product_id)
            
            # 更新产品数据
            product.price_sources = price_sources
            product.last_updated = datetime.now().isoformat()
            product.calculate_best_price()
            
            logger.info(f"✅ 同步产品价格: {product.name} - 最佳价格: ¥{product.best_price['price']} ({product.best_price['platform']})")
            self.save_cache()
            return True
            
        except Exception as e:
            logger.error(f"❌ 同步产品价格失败 {product_id}: {e}")
            return False
    
    def sync_all_prices(self) -> Dict[str, Any]:
        """同步所有产品价格"""
        results = {
            "success": 0,
            "failed": 0,
            "total": len(self.products),
            "products": []
        }
        
        for product_id, product in self.products.items():
            if self.sync_product_price(product_id):
                results["success"] += 1
                results["products"].append({
                    "id": product_id,
                    "name": product.name,
                    "best_price": product.best_price
                })
            else:
                results["failed"] += 1
        
        logger.info(f"✅ 价格同步完成: 成功 {results['success']}/{results['total']}")
        return results
    
    def get_product_price(self, product_id: str) -> Optional[Dict[str, Any]]:
        """获取产品价格信息"""
        product = self.products.get(product_id)
        if not product:
            return None
        
        return {
            "id": product.id,
            "name": product.name,
            "category": product.category,
            "specs": product.specs,
            "base_price": product.base_price,
            "price_sources": product.price_sources,
            "best_price": product.best_price,
            "last_updated": product.last_updated
        }
    
    def get_all_prices(self) -> List[Dict[str, Any]]:
        """获取所有产品价格"""
        return [self.get_product_price(pid) for pid in self.products.keys()]

class PriceAPIHandler(BaseHTTPRequestHandler):
    """价格API请求处理器"""
    
    def __init__(self, *args, **kwargs):
        self.db = PriceDatabase()
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        """处理GET请求"""
        try:
            parsed_path = urllib.parse.urlparse(self.path)
            path = parsed_path.path
            query = urllib.parse.parse_qs(parsed_path.query)
            
            # 设置CORS头
            self.send_cors_headers()
            
            if path == "/api/prices":
                # 获取所有价格
                prices = self.db.get_all_prices()
                self.send_json_response(200, {
                    "status": "success",
                    "count": len(prices),
                    "data": prices,
                    "timestamp": datetime.now().isoformat()
                })
                
            elif path == "/api/prices/sync":
                # 同步所有价格
                results = self.db.sync_all_prices()
                self.send_json_response(200, {
                    "status": "success",
                    "message": "价格同步完成",
                    "results": results,
                    "timestamp": datetime.now().isoformat()
                })
                
            elif path.startswith("/api/prices/"):
                # 获取单个产品价格
                product_id = path.split("/")[-1]
                price_info = self.db.get_product_price(product_id)
                
                if price_info:
                    self.send_json_response(200, {
                        "status": "success",
                        "data": price_info
                    })
                else:
                    self.send_json_response(404, {
                        "status": "error",
                        "message": f"产品不存在: {product_id}"
                    })
                    
            elif path == "/api/health":
                # 健康检查
                self.send_json_response(200, {
                    "status": "healthy",
                    "service": "PC硬件价格API",
                    "version": "1.0.0",
                    "timestamp": datetime.now().isoformat(),
                    "product_count": len(self.db.products)
                })
                
            else:
                self.send_json_response(404, {
                    "status": "error",
                    "message": "API端点不存在",
                    "available_endpoints": [
                        "/api/prices - 获取所有价格",
                        "/api/prices/sync - 同步所有价格",
                        "/api/prices/{id} - 获取单个产品价格",
                        "/api/health - 健康检查"
                    ]
                })
                
        except Exception as e:
            logger.error(f"❌ API处理错误: {e}")
            self.send_json_response(500, {
                "status": "error",
                "message": "服务器内部错误",
                "error": str(e)
            })
    
    def do_OPTIONS(self):
        """处理OPTIONS请求（CORS预检）"""
        self.send_cors_headers()
        self.send_response(200)
        self.end_headers()
    
    def send_cors_headers(self):
        """发送CORS头"""
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "86400")
    
    def send_json_response(self, status_code: int, data: Dict[str, Any]):
        """发送JSON响应"""
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_cors_headers()
        self.end_headers()
        
        response = json.dumps(data, ensure_ascii=False, indent=2)
        self.wfile.write(response.encode('utf-8'))
    
    def log_message(self, format, *args):
        """自定义日志格式"""
        logger.info(f"HTTP {self.address_string()} - {format % args}")

def run_server(port=8081):
    """运行API服务器"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, PriceAPIHandler)
    
    # 初始化数据库
    handler_class = PriceAPIHandler
    db = PriceDatabase()
    if not db.products:
        db.initialize_hardware_products()
        db.sync_all_prices()
    
    logger.info(f"🚀 PC硬件价格API服务启动在端口 {port}")
    logger.info(f"📊 已加载 {len(db.products)} 个硬件产品")
    logger.info("🌐 可用API端点:")
    logger.info("  GET /api/prices - 获取所有价格")
    logger.info("  GET /api/prices/sync - 同步所有价格")
    logger.info("  GET /api/prices/{id} - 获取单个产品价格")
    logger.info("  GET /api/health - 健康检查")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        logger.info("👋 服务器停止")
    except Exception as e:
        logger.error(f"❌ 服务器错误: {e}")

if __name__ == "__main__":
    run_server()