import React, { useState } from 'react';
import { 
  Settings, ToggleLeft, ToggleRight, Play, Server, Shield, Activity, 
  Terminal, ArrowRight, CheckCircle2, AlertTriangle, HelpCircle, RefreshCw
} from 'lucide-react';
import { Flow, FlowExecutionLog } from '../types';

interface SetupFlowViewProps {
  flows: Flow[];
  executionLogs: FlowExecutionLog[];
  onToggleFlow: (id: string) => void;
  onClearLogs: () => void;
  onResetLogs: () => void;
}

export default function SetupFlowView({
  flows,
  executionLogs,
  onToggleFlow,
  onClearLogs,
  onResetLogs,
}: SetupFlowViewProps) {
  const [selectedFlowId, setSelectedFlowId] = useState<string>(flows[0]?.id || '');
  const selectedFlow = flows.find(f => f.id === selectedFlowId);

  const getStatusIcon = (status: 'Success' | 'Warning' | 'Failed') => {
    switch (status) {
      case 'Success': return <CheckCircle2 className="text-emerald-500" size={14} />;
      case 'Warning': return <AlertTriangle className="text-amber-500" size={14} />;
      case 'Failed': return <Terminal className="text-red-500" size={14} />;
    }
  };

  const getStatusBadge = (status: 'Success' | 'Warning' | 'Failed') => {
    switch (status) {
      case 'Success': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Warning': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Failed': return 'bg-red-50 text-red-700 border-red-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Header */}
      <div className="bg-white border border-black/10 rounded-xl p-6 flex items-center justify-between shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-slate-950 text-white rounded-full">
              <Settings size={16} />
            </span>
            <h1 className="text-xl font-serif italic font-light text-[#1a1a1a]">
              Salesforce Setup: Agentforce Flow Orchestration
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Build and monitor background automation flows, salary validations, and Agentforce screening pipelines.
          </p>
        </div>
        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 hidden md:block">
          Active Engine Triggers: <span className="text-orange-600 font-black">3 Sourced</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column - Flows Toggles (Spans 4 columns) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-black/10 rounded-xl shadow-sm">
            <div className="bg-slate-50/80 px-5 py-3.5 border-b border-black/10 flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest font-black text-slate-700 flex items-center gap-1.5">
                <Shield size={14} className="text-orange-500" />
                Active Workflow Triggers
              </span>
            </div>

            <div className="p-3 divide-y divide-black/5">
              {flows.map(flow => (
                <div 
                  key={flow.id}
                  onClick={() => setSelectedFlowId(flow.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all space-y-2.5 group border ${
                    selectedFlowId === flow.id 
                      ? 'border-indigo-100 bg-indigo-50/30 shadow-sm' 
                      : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {flow.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFlow(flow.id);
                      }}
                      className="cursor-pointer text-indigo-600 hover:text-indigo-800 transition-all"
                      title={flow.active ? 'Disable Flow' : 'Enable Flow'}
                    >
                      {flow.active ? (
                        <ToggleRight size={22} className="text-indigo-600" />
                      ) : (
                        <ToggleLeft size={22} className="text-slate-300" />
                      )}
                    </button>
                  </div>

                  <p className="text-[10.5px] text-slate-500 leading-tight">
                    {flow.description}
                  </p>

                  <div className="flex justify-between items-center text-[9px] pt-1 font-bold uppercase tracking-wider">
                    <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono font-bold uppercase border border-black/5">
                      Trigger: {flow.trigger.split('(')[0]}
                    </span>
                    <span className={`font-bold ${flow.active ? 'text-green-600' : 'text-slate-400'}`}>
                      {flow.active ? '● Active' : '○ Suspended'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sourcing guidelines info card */}
          <div className="bg-orange-50/60 border border-orange-100 text-orange-950 p-5 rounded-xl space-y-3">
            <h4 className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Activity size={13} className="text-orange-600" />
              Automated Flow Validation Rules
            </h4>
            <p className="text-[10px] leading-relaxed">
              Whenever a candidate record changes stage (e.g. from Screening to Interview), the CRM engine launches active background flows in sequential nodes to check security rules.
            </p>
          </div>
        </div>

        {/* Center/Right Column - Visual Flow Nodes Designer & Execution Logs (Spans 8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          {/* FLOW DIAGRAM VIEWER */}
          {selectedFlow ? (
            <div className="bg-white border border-black/10 rounded-xl shadow-sm">
              <div className="bg-slate-50/80 px-5 py-3.5 border-b border-black/10 flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Visual Flow Canvas Designer</h3>
                  <p className="text-[10px] text-slate-400 mt-1">Flow: <span className="font-semibold text-slate-600">{selectedFlow.name}</span></p>
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${selectedFlow.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500'}`}>
                  {selectedFlow.active ? 'ACTIVE' : 'DRAFT'}
                </span>
              </div>

              {/* FLOW CANVAS DIAGRAM */}
              <div className="p-6 bg-slate-50/50 flex flex-col items-center justify-center space-y-4">
                {/* Node 1: Start Trigger */}
                <div className="bg-indigo-900 text-white px-5 py-3 rounded-xl shadow text-center w-58 border border-indigo-950/30 relative">
                  <span className="text-[9px] text-indigo-200 uppercase tracking-widest block font-bold mb-0.5">Trigger Start</span>
                  <span className="text-xs font-bold">{selectedFlow.trigger}</span>
                  <div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-4 h-4 bg-indigo-900 rotate-45 -z-10" />
                </div>

                {/* Arrow */}
                <ArrowRight size={16} className="text-slate-300 transform rotate-90" />

                {/* Sequential Steps Nodes */}
                {selectedFlow.steps.map((step, sIdx) => (
                  <React.Fragment key={sIdx}>
                    <div className="bg-white border border-black/10 text-slate-800 px-5 py-3.5 rounded-xl shadow-sm text-center w-64 flex items-center justify-center gap-2 font-bold text-xs hover:border-indigo-600 transition-colors">
                      <span className="w-5 h-5 bg-slate-100 border border-black/10 rounded-full flex items-center justify-center text-[10px] text-slate-500 font-mono">
                        {sIdx + 1}
                      </span>
                      <span>{step}</span>
                    </div>

                    {sIdx < selectedFlow.steps.length - 1 && (
                      <ArrowRight size={16} className="text-slate-300 transform rotate-90" />
                    )}
                  </React.Fragment>
                ))}

                {/* Arrow */}
                <ArrowRight size={16} className="text-slate-300 transform rotate-90" />

                {/* Terminal Status */}
                <div className="bg-[#1a1a1a] text-white px-5 py-3 rounded-xl shadow text-center w-58 border border-black/30">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold mb-0.5">Terminal Action</span>
                  <span className="text-xs font-bold">Log Execution Outcome</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-8 text-center rounded-xl border border-dashed border-black/10">
              <p className="text-xs text-slate-400 italic">Select an active flow from the left column to view visual canvas nodes.</p>
            </div>
          )}

          {/* FLOW EXECUTION LOGS TABLE */}
          <div className="bg-white border border-black/10 rounded-xl shadow-sm">
            <div className="bg-slate-50/80 px-5 py-3.5 border-b border-black/10 flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest font-black text-slate-700 flex items-center gap-1.5">
                <Terminal className="text-slate-500" size={14} />
                Agentforce CRM Workflow Logs (Live Feed)
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={onResetLogs}
                  title="Reload default logs"
                  className="p-1 text-slate-500 hover:text-slate-800 bg-white border border-black/10 rounded cursor-pointer transition-colors"
                >
                  <RefreshCw size={12} />
                </button>
                <button
                  onClick={onClearLogs}
                  className="text-[10px] font-bold uppercase tracking-widest text-red-600 hover:text-red-800 cursor-pointer"
                >
                  Clear Terminal Logs
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-black/10 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="px-4 py-2">Timestamp</th>
                    <th className="px-4 py-2">Flow Name</th>
                    <th className="px-4 py-2">Record Candidate</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Execution Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 text-[10.5px]">
                  {executionLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-slate-400 italic font-medium">
                        No background executions logged in this terminal session.
                      </td>
                    </tr>
                  ) : (
                    executionLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/40 transition-colors font-mono">
                        <td className="px-4 py-2.5 text-slate-400 whitespace-nowrap font-medium">
                          {log.timestamp}
                        </td>
                        <td className="px-4 py-2.5 text-slate-700 font-bold">
                          {log.flowName}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 font-semibold whitespace-nowrap">
                          {log.candidateName}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border flex items-center gap-1 w-fit ${getStatusBadge(log.status)}`}>
                            {getStatusIcon(log.status)}
                            {log.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-slate-500 leading-normal font-sans font-medium">
                          {log.message}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
