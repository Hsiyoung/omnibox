# 后端 API 修改示例
# 这是后端服务新增的路由文件

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
from datetime import datetime

router = APIRouter()

# 请求模型
class TodoItem(BaseModel):
    id: Optional[int] = None
    title: str
    description: Optional[str] = ""
    completed: bool = False
    created_at: Optional[str] = None

# 模拟数据库（在实际项目中应使用真实的数据库）
todo_database = []

@router.get("/api/v1/todos", response_model=List[TodoItem])
async def get_todos():
    """获取所有待办事项"""
    return todo_database

@router.post("/api/v1/todos", response_model=TodoItem)
async def create_todo(todo: TodoItem):
    """创建新的待办事项"""
    # 生成 ID 和创建时间
    todo.id = len(todo_database) + 1
    todo.created_at = datetime.now().isoformat()
    
    # 添加到"数据库"
    todo_database.append(todo)
    return todo

@router.put("/api/v1/todos/{todo_id}", response_model=TodoItem)
async def update_todo(todo_id: int, todo: TodoItem):
    """更新待办事项"""
    for i, existing_todo in enumerate(todo_database):
        if existing_todo.id == todo_id:
            todo_database[i] = todo
            todo_database[i].id = todo_id
            return todo_database[i]
    
    raise HTTPException(status_code=404, detail="Todo not found")

@router.delete("/api/v1/todos/{todo_id}")
async def delete_todo(todo_id: int):
    """删除待办事项"""
    for i, todo in enumerate(todo_database):
        if todo.id == todo_id:
            deleted_todo = todo_database.pop(i)
            return {"message": "Todo deleted successfully", "deleted": deleted_todo}
    
    raise HTTPException(status_code=404, detail="Todo not found")

@router.get("/api/v1/todos/stats")
async def get_todo_stats():
    """获取待办事项统计信息"""
    total = len(todo_database)
    completed = len([todo for todo in todo_database if todo.completed])
    pending = total - completed
    
    return {
        "total": total,
        "completed": completed,
        "pending": pending,
        "completion_rate": round((completed / total) * 100, 2) if total > 0 else 0
    }

# 示例：自定义内容处理接口
@router.post("/api/v1/process/text")
async def process_text_content(content: dict):
    """处理文本内容（类似 OmniBox 的文档处理功能）"""
    text = content.get("text", "")
    
    # 模拟文本处理：统计字数、分析关键词等
    word_count = len(text.split())
    char_count = len(text)
    
    # 简单的关键词提取（实际项目中使用更复杂的 NLP）
    words = text.lower().split()
    common_words = ["的", "是", "在", "有", "和", "与", "或", "但"]
    keywords = [word for word in words if len(word) > 2 and word not in common_words][:10]
    
    return {
        "original_length": char_count,
        "word_count": word_count,
        "keywords": keywords,
        "processed_at": datetime.now().isoformat(),
        "summary": f"文本包含 {word_count} 个单词，{char_count} 个字符"
    }