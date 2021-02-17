import { getCustomRepository, getRepository, In } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    // transformar o arquivo em um arquivo legível para que a gente possa manipular
    const contactsReadStream = fs.createReadStream(filePath);

    // pegar o conteudo a partir da segunda linha (ignorar o cabeçalho)
    const parsers = csvParse({
      delimiter: ';',
      from_line: 2,
    });

    // pipe vai ler as linhas conformes elas estao disponiveis
    const parseCSV = contactsReadStream.pipe(parsers);

    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    // on 'data' = a cada dado que passa, que estiver disponivel para leitura
    parseCSV.on('data', async line => {
      // desestruturar os valores de cada linha
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );
      if (!title || !type || !category) return;

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const existentsCategoriesInDB = await categoriesRepository.find({
      where: {
        title: In(categories), // verificar se no array de categorias que criamos tem alguma dentro do database
      },
    });
    const existentsCategoriesTitle = existentsCategoriesInDB.map(
      (category: Category) => category.title,
    );
    // remover as categorias existentes e remover duplicadas
    const addCategoriesTitle = categories
      .filter(category => !existentsCategoriesTitle.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoriesTitle.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentsCategoriesInDB];

    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionsRepository.save(createdTransactions);

    // deletar arquivo
    await fs.promises.unlink(filePath);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
