import React, { useState, useEffect } from 'react';
import { Calendar, Flag, GripVertical } from 'lucide-react';

const defaultTasks = [
  { id: 1, title: "Formar equipe de trabalho", phase: "ESTRUTURAÇÃO", responsible: "", deadline: "", category: "Equipe", status: "backlog", priority: "high", milestone: true },
  { id: 2, title: "Identificar stakeholders", phase: "ESTRUTURAÇÃO", responsible: "", deadline: "", category: "Mapeamento", status: "backlog", priority: "high", milestone: false },
  { id: 3, title: "Definir papéis e responsabilidades", phase: "ESTRUTURAÇÃO", responsible: "", deadline: "", category: "Equipe", status: "backlog", priority: "medium", milestone: false },
  { id: 4, title: "Selecionar organizações-alvo", phase: "ESTRUTURAÇÃO", responsible: "", deadline: "", category: "Seleção", status: "backlog", priority: "high", milestone: true },
  { id: 5, title: "Diagnosticar contexto organizacional", phase: "DIAGNÓSTICO", responsible: "", deadline: "", category: "Análise", status: "backlog", priority: "medium", milestone: false },
  { id: 6, title: "Estudar projetos organizacionais", phase: "DIAGNÓSTICO", responsible: "", deadline: "", category: "Análise", status: "backlog", priority: "medium", milestone: false },
  { id: 7, title: "Selecionar praticantes/participantes", phase: "DIAGNÓSTICO", responsible: "", deadline: "", category: "Seleção", status: "backlog", priority: "high", milestone: true },
  { id: 8, title: "Planejar cronograma e recursos", phase: "PLANEJAMENTO", responsible: "", deadline: "", category: "Planejamento", status: "backlog", priority: "high", milestone: false },
  { id: 9, title: "Definir instrumentos para entrevistas", phase: "PLANEJAMENTO", responsible: "", deadline: "", category: "Metodologia", status: "backlog", priority: "high", milestone: true },
  { id: 10, title: "Agendar entrevistas", phase: "PLANEJAMENTO", responsible: "", deadline: "", category: "Logística", status: "backlog", priority: "medium", milestone: false },
  { id: 11, title: "Realizar entrevistas com gravação", phase: "COLETA", responsible: "", deadline: "", category: "Pesquisa", status: "backlog", priority: "high", milestone: true },
  { id: 12, title: "Registrar observações de campo", phase: "COLETA", responsible: "", deadline: "", category: "Pesquisa", status: "backlog", priority: "medium", milestone: false },
  { id: 13, title: "Realizar transcrição das entrevistas", phase: "TRANSCRIÇÃO", responsible: "", deadline: "", category: "Processamento", status: "backlog", priority: "medium", milestone: false },
  { id: 14, title: "Revisar transcrições", phase: "TRANSCRIÇÃO", responsible: "", deadline: "", category: "Qualidade", status: "backlog", priority: "high", milestone: true },
  { id: 15, title: "Realizar análise de conteúdo", phase: "ANÁLISE", responsible: "", deadline: "", category: "Análise", status: "backlog", priority: "high", milestone: true },
  { id: 16, title: "Identificar padrões e boas práticas", phase: "ANÁLISE", responsible: "", deadline: "", category: "Análise", status: "backlog", priority: "high", milestone: false },
  { id: 17, title: "Elaborar cenários de aprendizagem", phase: "ELABORAÇÃO", responsible: "", deadline: "", category: "Produto", status: "backlog", priority: "high", milestone: true },
  { id: 18, title: "Validar cenários junto à equipe", phase: "ELABORAÇÃO", responsible: "", deadline: "", category: "Qualidade", status: "backlog", priority: "medium", milestone: false },
  { id: 19, title: "Apresentar cenários de aprendizagem", phase: "ELABORAÇÃO", responsible: "", deadline: "", category: "Entrega", status: "backlog", priority: "high", milestone: true },
  { id: 20, title: "Avaliar projeto (lições aprendidas)", phase: "ENCERRAMENTO", responsible: "", deadline: "", category: "Avaliação", status: "backlog", priority: "medium", milestone: false },
  { id: 21, title: "Organizar arquivos para upload", phase: "ENCERRAMENTO", responsible: "", deadline: "", category: "Documentação", status: "backlog", priority: "low", milestone: false },
  { id: 22, title: "Arquivar documentos e materiais", phase: "ENCERRAMENTO", responsible: "", deadline: "", category: "Documentação", status: "backlog", priority: "low", milestone: true }
];

export default function KanbanChecklist() {
  const [tasks, setTasks] = useState(() => {
    // Tentar carregar do localStorage ao iniciar
    try {
      const saved = localStorage.getItem('kanban-tasks');
      if (saved) {
        console.log('✓ Dados carregados do localStorage');
        return JSON.parse(saved);
      }
    } catch (error) {
      console.log('ℹ Usando dados padrão');
    }
    return defaultTasks;
  });

  const [draggedTask, setDraggedTask] = useState(null);

  // Salvar no localStorage sempre que tasks mudar
  useEffect(() => {
    try {
      localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
      console.log('✓ Dados salvos automaticamente');
    } catch (error) {
      console.error('✗ Erro ao salvar:', error);
    }
  }, [tasks]);

  const resetTasks = () => {
    if (confirm('Tem certeza que deseja resetar todos os dados para o padrão?')) {
      localStorage.removeItem('kanban-tasks');
      setTasks(defaultTasks);
      console.log('✓ Dados resetados');
    }
  };

  const columns = [
    { id: 'backlog', title: 'Backlog', color: 'border-red-300 bg-red-50' },
    { id: 'inprogress', title: 'Em Progresso', color: 'border-yellow-300 bg-yellow-50' },
    { id: 'onhold', title: 'Finalizado', color: 'border-green-300 bg-green-50' }
  ];

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedTask) {
      setTasks(tasks.map(task => 
        task.id === draggedTask.id ? { ...task, status: newStatus } : task
      ));
      setDraggedTask(null);
    }
  };

  const updateTask = (id, field, value) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Equipe': 'bg-purple-500',
      'Mapeamento': 'bg-blue-500',
      'Seleção': 'bg-indigo-500',
      'Análise': 'bg-cyan-500',
      'Planejamento': 'bg-teal-500',
      'Metodologia': 'bg-emerald-500',
      'Logística': 'bg-green-500',
      'Pesquisa': 'bg-orange-500',
      'Processamento': 'bg-amber-500',
      'Qualidade': 'bg-red-500',
      'Produto': 'bg-pink-500',
      'Entrega': 'bg-fuchsia-500',
      'Avaliação': 'bg-violet-500',
      'Documentação': 'bg-slate-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'text-red-600',
      'medium': 'text-yellow-600',
      'low': 'text-green-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const getColumnBorderColor = (columnId) => {
    const colors = {
      'backlog': 'border-t-red-500',
      'inprogress': 'border-t-yellow-500',
      'onhold': 'border-t-blue-500',
      'done': 'border-t-green-500'
    };
    return colors[columnId];
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold text-gray-800">Lista de Verificação de Projeto</h1>
            <button
              onClick={resetTasks}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
            >
              Resetar Dados
            </button>
          </div>
          <p className="text-xs text-green-600 mb-4">✓ Salvamento automático ativo</p>
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            {columns.map(col => {
              const count = getTasksByStatus(col.id).length;
              return (
                <div key={col.id} className="text-center">
                  <p className="text-2xl font-bold text-gray-800">{count}</p>
                  <p className="text-sm text-gray-600">{col.title}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sequential List */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Lista Ordenada de Atividades</h2>
          <div className="space-y-2">
            {tasks.map((task, index) => (
              <div 
                key={task.id} 
                className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${
                  task.milestone ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 bg-gray-50'
                }`}
              >
                <span className="font-bold text-gray-600 min-w-[30px]">{index + 1}.</span>
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{task.title}</h3>
                    {task.milestone && (
                      <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        ⭐ MARCO
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{task.phase}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-3 gap-4">
          {columns.map(column => (
            <div 
              key={column.id}
              className="bg-white rounded-lg shadow-md"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className={`border-t-4 ${getColumnBorderColor(column.id)} p-4 rounded-t-lg`}>
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-gray-800">{column.title}</h2>
                  <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">
                    {getTasksByStatus(column.id).length}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <div className="p-3 space-y-3 min-h-[500px]">
                {getTasksByStatus(column.id).map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    className={`border-2 ${
                      task.priority === 'high' ? 'border-red-300' :
                      task.priority === 'medium' ? 'border-blue-300' :
                      'border-green-300'
                    } ${task.milestone ? 'shadow-lg ring-4 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-white' : 'bg-white'} rounded-lg p-3 cursor-move hover:shadow-lg transition-all`}
                  >
                    {/* Milestone Badge */}
                    {task.milestone && (
                      <div className="mb-2 flex items-center justify-center">
                        <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                          ⭐ MARCO DO PROJETO
                        </span>
                      </div>
                    )}

                    {/* Task Header */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm text-gray-800 flex-grow pr-2">
                        {task.title}
                      </h3>
                      <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>

                    {/* Phase Tag */}
                    <div className="mb-2">
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {task.phase}
                      </span>
                    </div>

                    {/* Deadline */}
                    <div className="mb-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        <label className="text-xs text-gray-500">Prazo</label>
                      </div>
                      <input
                        type="date"
                        value={task.deadline}
                        onChange={(e) => updateTask(task.id, 'deadline', e.target.value)}
                        className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Priority */}
                    <div className="flex items-center gap-1 mt-2">
                      <Flag className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />
                      <select
                        value={task.priority}
                        onChange={(e) => updateTask(task.id, 'priority', e.target.value)}
                        className={`text-xs font-semibold ${getPriorityColor(task.priority)} border-none bg-transparent focus:outline-none cursor-pointer`}
                      >
                        <option value="high">Alta</option>
                        <option value="medium">Média</option>
                        <option value="low">Baixa</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}