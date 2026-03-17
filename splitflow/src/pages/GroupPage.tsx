import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import GroupBalanceCard from "../components/group/GroupBalanceCard";
import TransactionFeed from "../components/group/TransactionFeed";
import GroupDetailsBar from "../components/group/GroupDetailsBar";
import OptimizationEngineCard from "../components/group/OptimizationEngineCard";
import Header from "../components/navigation/Header";
import Sidebar from "../components/navigation/Sidebar";
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
  const [membersCount, setMembersCount] = useState(cached?.membersCount ?? 0);
  const [balance, setBalance] = useState(cached?.balance ?? 0);
  const [transactionGroups, setTransactionGroups] = useState<TransactionGroup[]>(cached?.transactionGroups ?? []);
  const [settlements, setSettlements] = useState<DebtSettlement[]>(cached?.settlements ?? []);

  useEffect(() => {
    if (!groupId) return;
    const currentUserId = getCurrentUserId();

    buildGroupCache(groupId, currentUserId).then(fresh => {
      setGroupName(fresh.groupName);
      setCategory(fresh.category);
      setMembersCount(fresh.membersCount);
      setBalance(fresh.balance);
      setTransactionGroups(fresh.transactionGroups);
      setSettlements(fresh.settlements);
      saveGroupCache(groupId, fresh);
    });
  }, [groupId]);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        <Header
          title={groupName || 'Loading...'}
          icon={<PaperAirplaneIcon />}
        />
        <GroupDetailsBar
          category={category}
          membersCount={membersCount}
          memberAvatars={[]}
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
