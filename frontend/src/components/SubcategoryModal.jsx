import React, { useEffect, useState } from "react";

import ErrorMessage from './ErrorMessage';
import { useTranslation } from "react-i18next";



const SubcategoryModal = ({ active, handleModal, token, categoryId, categoryName}) => {
    const {i18n, t} = useTranslation();

    const [subcategoryName, setSubcategoryName] = useState('');
    const [subcategoryDescription, setSubcategoryDescription] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() =>{

    },[]);

    const handleAddSubcategory = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ subcategory_name: subcategoryName, 
                subcategory_description: subcategoryDescription, 
                category_id: categoryId
            }),
        };
        const response = await fetch(`/api/subcategories`, requestOptions);

        if(!response.ok) {
            setErrorMessage(t("error_add_subcategory"));
        } else {
            cleanFormData();
            handleModal();
        }
    };
    const cleanFormData  =()=>{
        setSubcategoryName("");
        setSubcategoryDescription("");
    };

    const handleAdd = (e) => {
            handleAddSubcategory();
    };

    return(
        <div className={`modal ${active && "is-active"}`}>
            <div className="modal-background" onClick={handleModal}></div>
            <div className="modal-card">
                <header className="modal-card-head has-background-primary-light">
                    <h1 className="modal-card-title">
                        {t("subcategory_modal_title")} "{categoryName}"
                    </h1>
                </header>
                <section className="modal-card-body">
                    <form>
                        <div className="field">
                            <label className="label">{t("subcategory_name")}</label>
                            <div className="control">
                                <input type="text" className="input" required placeholder={t("subcategory_name_placeholder")}value={subcategoryName} onChange={(e) => setSubcategoryName(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">{t("subcategory_description")}</label>
                            <div className="control">
                                <textarea className="input" required placeholder={t("subcategory_description_placeholder")} value={subcategoryDescription} onChange={(e) => setSubcategoryDescription(e.target.value)} />
                            </div>
                        </div>
                        <ErrorMessage message={errorMessage}/>
                    </form>
                </section>
                <footer className="modal-card-foot has-background-primary-light">
                    <button className="button is-info" onClick={handleAdd}>{t("button_add")}</button>
                    <button className="button" onClick={handleModal}>{t("button_cancel")}</button>
                </footer>
            </div>
        </div>
    );
};

export default SubcategoryModal;