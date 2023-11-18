import React, { useState, useEffect, useContext } from 'react';

import { ReloadContext } from '../context/ReloadContext';

import SubcategoryModal from "./SubcategoryModal";
import { useTranslation } from 'react-i18next';

const Categories = ({ token })=>{
    const {i18n, t} = useTranslation();

    const {reload, triggerReload} = useContext(ReloadContext);
    const [loaded, setLoaded] = useState(false);

    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    const [activeModal, setActiveModal] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [categoryName, setCategoryName] = useState(null);

       useEffect(() => {
        getCategories();
       }, [reload]);

       const getCategories = async () => {
        fetch('/api/categories', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': 'application/json',
            },
          })
            .then(response => response.json())
            .then(data => setCategories(data));
            setLoaded(true);
       };


       const handleCategoryClick = (categoryId) => {
            setActiveCategory(categoryId);
           fetch(`/api/subcategories/${categoryId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': 'application/json',
            },
          })
               .then(response => response.json())
               .then(data => setSubcategories(data));
            setLoaded(true);
       };

       const handleAddSubcategory = async ({id, name}) =>{
        setCategoryId(id);
        setCategoryName(name);
        setActiveModal(true);
        };

       const handleModal = () =>{
        setActiveModal(!activeModal);
        getCategories();
        handleCategoryClick(categoryId);
        setCategoryId(null);
        setCategoryName(null);
        triggerReload();
        };


       return (
           <div>
                <SubcategoryModal active={activeModal} handleModal={handleModal} token={token} categoryId={categoryId} categoryName={categoryName}/>
               <ul className='has-text-centered'>
                   {categories.map(category => (
                       <li  key={category.category_id} onClick={() => handleCategoryClick(category.category_id)}>
                           <div className={`notification is-fullwidth ${category.category_color}`}>
                            <p className={`title is-fullwidth`}>
                                {t(`categories_${category.category_name}`)}
                            </p>
                            <p className="subtitle">
                                {category.category_description}
                            </p>
                           <ul>
                               {subcategories.filter(sub => sub.category_id === category.category_id).map(subcategory => (
                                   <li key={subcategory.subcategory_id}>
                                    <div className={`notification is-light is-large ${category.category_color}`}>
                                        <p className='title is-5'>{subcategory.subcategory_name}</p>
                                        <p className="subtitle is-6">{subcategory.subcategory_description}</p>
                                    </div>
                                    <br/>
                                   </li>
                               ))}
                           </ul>
                            {activeCategory===category.category_id ? (
                                <button key={category.category_id} className="button mr-2 is-white" onClick={() => handleAddSubcategory( {id:category.category_id, name:category.category_name})}>
                                        {t("categories_add_subcategory")}
                                    </button>
                           ):null}
                           </div>
                       </li>
                   ))}
               </ul>
           </div>
       );
};

export default Categories;