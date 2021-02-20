import React, { useState, useCallback, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import api from '../../services/api';
import { formatValue, revertFormattedValue } from '../../utils/formatValue';

import { Transaction } from '../../pages/Dashboard';

import { Container } from './styles';

import Input from '../Input';
import formatDate from '../../utils/formatDate';

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

interface TransactionFormData {
  title: string;
  value: string;
  category: string;
}

interface TransactionModalProps {
  handleChangeModalVisibility: Function;
  transactions: Transaction[];
  setTransactions: Function;
  balance: Balance;
  setBalance: Function;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  handleChangeModalVisibility,
  transactions,
  setTransactions,
  balance,
  setBalance,
}: TransactionModalProps) => {
  const formRef = useRef<FormHandles>(null);

  const [type, setType] = useState('income');

  const handleSubmit = useCallback(
    async (formData: TransactionFormData) => {
      const transactionData = {
        ...formData,
        type,
      };
      try {
        const { data } = await api.post('/transactions', transactionData);

        const transactionFormatted = {
          ...data.transaction,
          formattedValue: formatValue(data.transaction.value),
          formattedDate: formatDate(data.transaction.created_at),
        };

        const balanceFormatted = {
          income: revertFormattedValue(balance.income),
          outcome: revertFormattedValue(balance.outcome),
          total: revertFormattedValue(balance.total),
        };

        console.log(balanceFormatted.income);
        if (type === 'income') {
          balanceFormatted.income += parseFloat(data.transaction.value);
        } else {
          balanceFormatted.outcome += parseFloat(data.transaction.value);
        }
        console.log(balanceFormatted.income);

        balanceFormatted.total =
          balanceFormatted.income - balanceFormatted.outcome;

        setTransactions(transactions.concat(transactionFormatted));
        setBalance({
          income: formatValue(balanceFormatted.income),
          outcome: formatValue(balanceFormatted.outcome),
          total: formatValue(balanceFormatted.total),
        });
        handleChangeModalVisibility(false);
      } catch (err) {
        alert(err);
      }
    },
    [
      balance,
      type,
      transactions,
      setTransactions,
      setBalance,
      handleChangeModalVisibility,
    ],
  );

  return (
    <Container>
      <Form onSubmit={handleSubmit} ref={formRef}>
        <h1>Adicionar nova transação</h1>

        <Input name="title" type="text" placeholder="Titulo da transação" />

        <div className="input-wrapper">
          <Input name="value" type="number" placeholder="Valor" />

          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="income">Entrada</option>
            <option value="outcome">Saída</option>
          </select>

          <Input name="category" type="text" placeholder="Categoria" />
        </div>

        <button type="submit">Adicionar</button>

        <FiX
          size={35}
          color="#ff872c"
          onClick={() => handleChangeModalVisibility(false)}
        />
      </Form>
    </Container>
  );
};

export default TransactionModal;
