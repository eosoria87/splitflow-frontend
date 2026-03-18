import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GroupBalanceCard from "../components/group/GroupBalanceCard";
import TransactionFeed from "../components/group/TransactionFeed";
import GroupDetailsBar from "../components/group/GroupDetailsBar";
import OptimizationEngineCard from "../components/group/OptimizationEngineCard";
import Sidebar from "../components/layout/Sidebar";
import MainContainer from "../components/ui/MainContainer";
import { buildGroupCache, loadGroupCache, saveGroupCache } from '../services/groupCacheService';
import type { TransactionGroup } from '../types/Transaction';
import type { DebtSettlement } from '../types/Debt';

const getCurrentUserId = (): string => {
  try { return JSON.parse(localStorage.getItem('sf_user') || '{}').id ?? ''; }
  catch { return ''; }
};

const GroupPage = () => {
  const { id: groupId } = useParams<{ id: string }>();

  const cached = groupId ? loadGroupCache(groupId) : null;

  const [groupName, setGroupName] = useState(cached?.groupName ?? '');
  const [category, setCategory] = useState(cached?.category ?? 'other');
  const [createdAt, setCreatedAt] = useState(cached?.createdAt ?? '');
  const [memberNames, setMemberNames] = useState<string[]>(cached?.memberNames ?? []);
  const [balance, setBalance] = useState(cached?.balance ?? 0);
  const [transactionGroups, setTransactionGroups] = useState<TransactionGroup[]>(cached?.transactionGroups ?? []);
  const [settlements, setSettlements] = useState<DebtSettlement[]>(cached?.settlements ?? []);

  const refresh = (id: string) => {
    buildGroupCache(id, getCurrentUserId()).then(fresh => {
      setGroupName(fresh.groupName);
      setCategory(fresh.category);
      setCreatedAt(fresh.createdAt);
      setMemberNames(fresh.memberNames);
      setBalance(fresh.balance);
      setTransactionGroups(fresh.transactionGroups);
      setSettlements(fresh.settlements);
      saveGroupCache(id, fresh);
    });
  };

  useEffect(() => {
    if (!groupId) return;
    refresh(groupId);
  }, [groupId]);

  useEffect(() => {
    if (!groupId) return;
    const handler = (e: Event) => {
      if ((e as CustomEvent).detail?.groupId === groupId) refresh(groupId);
    };
    window.addEventListener('expense-added', handler);
    return () => window.removeEventListener('expense-added', handler);
  }, [groupId]);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        <GroupDetailsBar
          groupName={groupName}
          category={category}
          dateRange={createdAt ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined}
          memberNames={memberNames}
        />
        <MainContainer columnsNum={3}>
          <div className="xl:col-span-2 flex flex-col gap-4">
            <TransactionFeed groups={transactionGroups} />
          </div>
          <div className="xl:col-span-1 space-y-6 lg:sticky lg:top-8">
            <GroupBalanceCard balance={balance} />
            <OptimizationEngineCard settlements={settlements} />
          </div>
        </MainContainer>
      </main>
    </div>
  );
};

export default GroupPage;
