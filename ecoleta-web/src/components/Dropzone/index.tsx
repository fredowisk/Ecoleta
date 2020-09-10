import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {FiUpload} from 'react-icons/fi';

import './styles.css';

interface Props {
//uma função que recebe um arquivo do tipo File e retorna void
onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({onFileUploaded}) => {

  //estado que vai salvar a imagem selecionada
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    //como só teremos um arquivo, ele sempre estará na posição 0
    const file = acceptedFiles[0];

    const fileUrl = URL.createObjectURL(file);

    setSelectedFileUrl(fileUrl);
    //passando o arquivo, para que ele possa ser setado como selecionado
    // la no createPoint/index.tsx
    onFileUploaded(file);
  }, [onFileUploaded]);

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    //aceite apenas imagens
    accept: 'image/*'
  });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*"/>
      {
        selectedFileUrl ?
        <img src={selectedFileUrl} alt="Point thumbnail" /> 
        :(
          <p>
            <FiUpload/>
            Coloque a imagem do estabelecimento aqui
          </p>
        )
      }
    </div>
  )
}

export default Dropzone;