import React, { useState, useEffect } from 'react';

interface TodoItem {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at?: string;
}

interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  completion_rate: number;
}

const CustomTodoPage: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [stats, setStats] = useState<TodoStats | null>(null);
  const [newTodo, setNewTodo] = useState<TodoItem>({
    title: '',
    description: '',
    completed: false
  });
  const [textToProcess, setTextToProcess] = useState('');
  const [processedResult, setProcessedResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 获取待办事项列表
  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/v1/todos');
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error('获取待办事项失败:', error);
    }
  };

  // 获取统计信息
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/v1/todos/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('获取统计信息失败:', error);
    }
  };

  // 创建新的待办事项
  const createTodo = async () => {
    if (!newTodo.title.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/v1/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      });
      
      if (response.ok) {
        const createdTodo = await response.json();
        setTodos([...todos, createdTodo]);
        setNewTodo({ title: '', description: '', completed: false });
        fetchStats();
      }
    } catch (error) {
      console.error('创建待办事项失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 切换完成状态
  const toggleTodo = async (todo: TodoItem) => {
    try {
      const updatedTodo = { ...todo, completed: !todo.completed };
      const response = await fetch(`/api/v1/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo)
      });
      
      if (response.ok) {
        setTodos(todos.map(t => t.id === todo.id ? updatedTodo : t));
        fetchStats();
      }
    } catch (error) {
      console.error('更新待办事项失败:', error);
    }
  };

  // 删除待办事项
  const deleteTodo = async (todoId: number) => {
    try {
      const response = await fetch(`/api/v1/todos/${todoId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setTodos(todos.filter(t => t.id !== todoId));
        fetchStats();
      }
    } catch (error) {
      console.error('删除待办事项失败:', error);
    }
  };

  // 处理文本内容
  const processText = async () => {
    if (!textToProcess.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/v1/process/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToProcess })
      });
      
      if (response.ok) {
        const result = await response.json();
        setProcessedResult(result);
      }
    } catch (error) {
      console.error('处理文本失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
    fetchStats();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">我的自定义功能 - 待办事项管理</h1>
      
      {/* 统计信息 */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">总数</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">已完成</div>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">待完成</div>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.completion_rate}%</div>
            <div className="text-sm text-gray-600">完成率</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 待办事项管理 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">待办事项管理</h2>
          
          {/* 添加新的待办事项 */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="输入待办事项标题"
              value={newTodo.title}
              onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
              className="w-full p-2 border rounded mb-2"
            />
            <textarea
              placeholder="描述（可选）"
              value={newTodo.description}
              onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
              className="w-full p-2 border rounded mb-2"
              rows={2}
            />
            <button
              onClick={createTodo}
              disabled={loading || !newTodo.title.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? '创建中...' : '添加待办事项'}
            </button>
          </div>

          {/* 待办事项列表 */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {todos.map((todo) => (
              <div key={todo.id} className={`p-3 border rounded ${todo.completed ? 'bg-gray-50' : 'bg-white'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo)}
                      className="h-4 w-4"
                    />
                    <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                      {todo.title}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id!)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    删除
                  </button>
                </div>
                {todo.description && (
                  <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
                )}
                {todo.created_at && (
                  <p className="text-xs text-gray-400 mt-1">
                    创建时间: {new Date(todo.created_at).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 文本处理功能 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">文本处理工具</h2>
          
          <div className="mb-4">
            <textarea
              placeholder="输入要处理的文本内容..."
              value={textToProcess}
              onChange={(e) => setTextToProcess(e.target.value)}
              className="w-full p-2 border rounded"
              rows={8}
            />
            <button
              onClick={processText}
              disabled={loading || !textToProcess.trim()}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 mt-2"
            >
              {loading ? '处理中...' : '处理文本'}
            </button>
          </div>

          {/* 处理结果 */}
          {processedResult && (
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">处理结果:</h3>
              <div className="space-y-2">
                <p><strong>字数统计:</strong> {processedResult.word_count} 个单词, {processedResult.original_length} 个字符</p>
                <p><strong>摘要:</strong> {processedResult.summary}</p>
                {processedResult.keywords && (
                  <div>
                    <strong>关键词:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {processedResult.keywords.map((keyword: string, index: number) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  处理时间: {new Date(processedResult.processed_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 使用说明 */}
      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">功能说明:</h3>
        <ul className="text-sm space-y-1">
          <li>• 这个页面展示了如何在 OmniBox 中添加自定义功能</li>
          <li>• 待办事项功能演示了 CRUD 操作的实现</li>
          <li>• 文本处理功能展示了内容分析和处理的流程</li>
          <li>• 你可以基于这个模板开发更多自定义功能</li>
        </ul>
      </div>
    </div>
  );
};

export default CustomTodoPage;