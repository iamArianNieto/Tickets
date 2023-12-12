import React, { useState, useEffect } from 'react';
import '../../CSS/cargar.css';
import FileViewer from 'react-file-viewer';
import { FaUpload } from 'react-icons/fa';

function FileUploadForm({ selectedFile, handleFileChange }) {
    const [previewType, setPreviewType] = useState(null);
    const [previewLink, setPreviewLink] = useState(null);
    const [file, setFile] = useState(null);


    const handleFileChangeLocal = (e) => {
        const file = e.target.files[0];
        handleFileChange(file);
        setPreviewType(null);
        setPreviewLink(null);

        if (file) {
            const reader = new FileReader();
            const fileExtension = file.name.split('.').pop().toLowerCase();
            reader.onloadend = () => {
                if (fileExtension === 'pdf' || fileExtension === 'docx' || fileExtension === 'xlsx' || file.type.startsWith('image/')) {
                    setPreviewType(fileExtension);
                    setPreviewLink(reader.result);
                }
            };

            reader.readAsDataURL(file);
        }
        else {
            setPreviewLink(null);
        }
        console.log('Estado del archivo antes de setFile:', file);
        setFile(file);
        console.log('Estado del archivo después de setFile:', file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (handleFileChange) {
            console.log('Archivo seleccionado:', handleFileChange);
            handleFileChange(null);
            setPreviewType(null);
            setPreviewLink(null);
        } else {
            alert('Por favor, selecciona un archivo antes de enviar.');
        }
    };


    return (
        <div className="body-form">
            <h3>Agrega Archivos PDF, DOCX, XLSX, PNG, JPG</h3>
            <br></br><br></br>
            <form id="frm_principal" action="/api/tickets" encType="multipart/form-data" onSubmit={handleSubmit}>

                <input
                    id="txt_archivos"
                    type="file"
                    name="file"
                    accept=".pdf,.docx,.xlsx,.png,.jpg"
                    onChange={handleFileChangeLocal}
                    style={{
                        display: "none",
                    }}
                />
                <label id='lbl_archivos' htmlFor="txt_archivos" className="custom-file-archivos">
                    <FaUpload style={{ marginRight: '10px' }} />
                    Selecciona un archivo
                </label>
                {selectedFile ? null : (
                    <img
                        id='img_predeterminada'
                        src="https://i.ibb.co/wLb5xnM/Logo-Tickets.png"
                        alt="Logo Tickets"
                        className="img-fluid mx-auto d-block"
                        style={{
                            maxWidth: '32%',
                            paddingTop: '2rem',
                        }}
                    />
                )}
            </form>

            {previewType === 'docx' && selectedFile ? (
                <div>
                    <br></br>
                    <h4 className="normal-text">Vista previa de Word</h4>
                    <br></br>
                    <div style={{
                        width: '390px',
                        height: '189px',
                        marginLeft: '33%',
                        marginTop: '1%'
                    }}>
                        <FileViewer
                            fileType={previewType}
                            filePath={URL.createObjectURL(selectedFile)}
                            viewerOptions={{
                                embedViewer: true,
                            }}
                            scaling={0.1}
                            width={400}
                            height={100}
                        />
                    </div>
                </div>
            ) : (
                previewType === 'pdf' && selectedFile ? (
                    <div>
                        <br></br>
                        <h4 className="normal-text">Vista previa de PDF</h4>
                        <br></br>
                        <div style={{
                            width: '390px',
                            height: '189px',
                            marginTop: '1%'
                        }}>
                            <FileViewer
                                fileType={previewType}
                                filePath={URL.createObjectURL(selectedFile)}
                                viewerOptions={{
                                    embedViewer: true,
                                }}
                                scaling={0.5}
                                width={400}
                                height={100}
                            />
                        </div>
                    </div>

                ) : (
                    previewType === 'xlsx' && selectedFile ? (
                        <div>
                            <br></br>
                            <h4 className="normal-text">Vista previa de Excel</h4>
                            <br></br>
                            <div style={{
                                maxWidth: '100%',
                                height: 'auto',
                                maxHeight: '218px',
                            }}>
                                <FileViewer
                                    fileType={previewType}
                                    filePath={URL.createObjectURL(selectedFile)}
                                    viewerOptions={{
                                        embedViewer: true,
                                    }}
                                    scaling={0.5}
                                    width={400}
                                    height={100}
                                />
                            </div>
                        </div>
                    ) : (

                        previewLink && (
                            <div>
                                <br></br>
                                <h4 className="normal-text">Vista Previa de Imágenes</h4>
                                <br></br>
                                {selectedFile.type.startsWith('image/') ? (
                                    <img
                                        id='img_vista'
                                        src={previewLink}
                                        alt="Vista previa"
                                        className='image-preview'
                                        style={{
                                            maxWidth: '100%',
                                            height: 'auto',
                                            maxHeight: '218px',
                                        }}
                                    />
                                ) : (
                                    <iframe
                                        id='frame_vista'
                                        src={previewLink}
                                        title="Vista previa"
                                        style={{ width: '100%', height: 'auto' }}
                                    ></iframe>
                                )}
                            </div>
                        )
                    )
                )
            )}
        </div>
    );
}

export const handleSend = (selectedFile) => {
    if (!selectedFile) {
        console.log('Elige un archivo .png, .jpg, .xml, .docx o .pdf');
        return;
    }
};

export default FileUploadForm;