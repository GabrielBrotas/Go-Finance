import React, { useState, useEffect, useCallback } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';
import TransactionModal from '../../components/TransactionModal';

import { formatValue } from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import {
  Container,
  CardContainer,
  Card,
  TableContainer,
  Button,
} from './styles';

export interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChangeModalVisibility = useCallback((status: boolean) => {
    setIsModalOpen(status);
  }, []);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const { data } = await api.get('/transactions');

      const transactionsFormatted = data.transactions.map(
        (transaction: Transaction) => ({
          ...transaction,
          formattedValue: formatValue(transaction.value),
          formattedDate: formatDate(transaction.created_at),
        }),
      );

      const balanceFormatted = {
        income: formatValue(data.balance.income),
        outcome: formatValue(data.balance.outcome),
        total: formatValue(data.balance.total),
      };

      setTransactions(transactionsFormatted);
      setBalance(balanceFormatted);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>

          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>

          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <Button type="button" onClick={() => handleChangeModalVisibility(true)}>
          Adicionar nova transação
        </Button>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td
                    className={
                      transaction.type === 'income' ? 'income' : 'outcome'
                    }
                  >
                    {transaction.type === 'outcome' && ' - '}
                    {transaction.formattedValue}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>

        {isModalOpen && (
          <TransactionModal
            handleChangeModalVisibility={handleChangeModalVisibility}
            transactions={transactions}
            setTransactions={setTransactions}
            balance={balance}
            setBalance={setBalance}
          />
        )}
      </Container>
    </>
  );
};

export default Dashboard;
