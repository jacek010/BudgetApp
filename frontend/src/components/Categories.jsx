import React, { useState, useEffect, useContext } from 'react';

import { ReloadContext } from '../context/ReloadContext';

import SubcategoryModal from "./SubcategoryModal";

const Categories = ({ token })=>{

    const {reload, triggerReload} = useContext(ReloadContext);
    const [loaded, setLoaded] = useState(false);

    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    const [activeModal, setActiveModal] = useState(false);
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
                                {category.category_name}
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
                           <button className="button mr-2 is-white" onClick={() => handleAddSubcategory( {id:category.category_id, name:category.category_name})}>Add subcategory</button>
                           </div>
                       </li>
                   ))}
               </ul>
           </div>
       );
};

export default Categories;