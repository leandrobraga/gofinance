import React, { useState } from 'react';
import { 
  Modal, 
  TouchableWithoutFeedback, 
  Keyboard,
  Alert 
} from 'react-native'; 
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver} from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { CategorySelect } from '../CategorySelect';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/auths';

import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes
} from './styles';


interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup
  .string()
  .required("Nome é obrigatório"),
  amount: Yup
  .number()
  .typeError("Informe um valor númerico")
  .positive("O valor não pode ser negativo")
  .required("O valor é obrigatório")
});

export function Register() {
  const { user } = useAuth();

  const dataKey = `@gofinace:transactions_user:${user.id}`;

  const [transcationType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  // const navigation = useNavigation();

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  function handleTransactionTypeSelect(type: 'positive'| 'negative'){
    setTransactionType(type);
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  async function handleRegister(form: FormData) {
    if(!transcationType)
      return Alert.alert('Selecione o tipo da transação')
    
    if(category.key === 'category')
      return Alert.alert('Selecione uma categoria')
    
    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transcationType,
      category: category.key,
      date: new Date(),
    }

    try{
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const formatedData = [
        ...currentData,
        newTransaction
      ];

      await AsyncStorage.setItem(dataKey, JSON.stringify(formatedData));

      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria',
      });
      reset();
      // navigation.navigate('Listagem');
    } catch(error) {
      console.log(error);
      Alert.alert("Não foi possível salvar.");
    }
  }

  return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm 
              name="name"
              placeholder="Nome"
              control={control}
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm 
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />
            <TransactionsTypes>
              <TransactionTypeButton 
                type="up" 
                title="Income"
                isActive={transcationType === 'positive'}
                onPress={() => handleTransactionTypeSelect('positive')}
              />
              <TransactionTypeButton 
                type="down" 
                title="Outcome"
                isActive={transcationType === 'negative'}
                onPress={() => handleTransactionTypeSelect('negative')}
              />
            </TransactionsTypes>
            
            <CategorySelectButton
              testID="button-category"
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>
          
          <Button
            title="Enviar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>
        
        <Modal testID="modal-category" visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}