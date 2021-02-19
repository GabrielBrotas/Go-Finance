import React, { InputHTMLAttributes, useEffect, useRef } from 'react';
import { useField } from '@unform/core';

import { Input } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string; // tornar a tag name obrigatoria
}

const InputComponent: React.FC<InputProps> = ({
  name,
  ...rest
}: InputProps) => {
  const inputRef = useRef(null);

  const { fieldName, defaultValue, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return <Input defaultValue={defaultValue} ref={inputRef} {...rest} />;
};

export default InputComponent;
