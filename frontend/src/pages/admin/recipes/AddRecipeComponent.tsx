import React, {useEffect, useState} from "react";
import {Loader} from "lucide-react";
import * as Yup from "yup";
import {AxiosError} from "axios";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Alerts} from "@/components/Alerts";
import {AlertEnums} from "@/enums/AlertEnums";
import {IngredientTypes, RecipesFileType} from "@/types/RecipesType";
import {getRecipeJoin, RecipeItemResponseJoin, saveRecipesRequest} from "@/api/admin/admin.recipes.api";
import {FactoryType} from "@/types/FactoryType";
import {getFactories} from "@/api/admin/admin.factories.api";
import {capitalize} from "@/helpers/text.helper";
import {RecipeIngredientComponent} from "@/pages/admin/recipes/RecipeIngredientComponent";
import {IngredientTypesEnum} from "@/enums/IngredientTypesEnum";
import {getProducts} from "@/api/admin/admin.products.api";
import {ProductType} from "@/types/ProductType";

type IngredientFormItem = IngredientTypes & {
    clientId: number;
};

const createIngredientFormItem = (clientId: number): IngredientFormItem => ({
    clientId,
    id: 0,
    ingredientType: IngredientTypesEnum.VEGETABLE,
    productId: 0,
    ingredientNeedsCount: 0,
});

const recipeIngredientToFormItem = (ingredient: IngredientTypes, fallbackClientId: number): IngredientFormItem => ({
    clientId: ingredient.id ?? fallbackClientId,
    id: ingredient.id ?? 0,
    recipeId: ingredient.recipeId,
    ingredientType: ingredient.ingredientType,
    productId: ingredient.productId,
    ingredientNeedsCount: ingredient.ingredientNeedsCount,
});

export const AddRecipeComponent = ({id, cb}: { id: number, cb: () => void }) => {



    const [factories, setFactories] = useState<FactoryType[]>([]);

    const [recipe, setRecipe] = useState<RecipeItemResponseJoin | undefined>(undefined);

    const [products, setProducts] = useState<ProductType[]>([]);

    const [loading, setLoading] = useState(true);


    const [ingredients, setIngredients] = useState<IngredientFormItem[]>([
        createIngredientFormItem(1),
    ]);


    const handleGetRecipe = async (id: number) => {
        setLoading(true);
        const data = await getRecipeJoin(id);
        setRecipe(data);
        setIngredients(
            data.recipesIngredients.length > 0
                ? data.recipesIngredients.map((ingredient, index) =>
                    recipeIngredientToFormItem(ingredient.recipesIngredients, Date.now() + index)
                )
                : [createIngredientFormItem(Date.now())]
        );

        const factoryData = await getFactories();
        setFactories(factoryData.items);

        const productsList = await getProducts();
        setProducts(productsList.items)


    };

    useEffect(() => {

        (async () => {
            await handleGetRecipe(id);
            setLoading(false);
        })()

    }, [id, setRecipe]);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [disableBtn, setDisableBtn] = useState(false);

    const validateSchema = Yup.object({
        productId: Yup.number().required("Product is required").moreThan(0, 'Price is required'),
        title: Yup.string().required("Title is required"),
        price: Yup.number().required("Number is required").moreThan(0, 'Price is required'),
        factoryId: Yup.number().required("Factory is required").moreThan(0, 'Factory is required'),
        availableFromLevel: Yup.number().required("Available From Level is required"),
        xpOnCollect: Yup.number().required("XP on collect is required"),
        takeEnergyCollect: Yup.number().required("Take Energy Collect is required"),
        ingredientsCount: Yup.number().required("Need minimum 1 ingredient").moreThan(0, 'Need minimum 1 ingredient'),
    });


    const handleSubmit = async (values: RecipesFileType) => {

        setError(null);
        setDisableBtn(true);


        const productId = values.productId;
        const title = values.title;
        const price = values.price;
        const factoryId = values.factoryId;
        const availableFromLevel = values.availableFromLevel;
        const xpOnCollect = values.xpOnCollect;
        const takeEnergyCollect = values.takeEnergyCollect;

        const formData = new FormData();
        formData.append('id', id.toString())
        formData.append("title", title);
        formData.append("productId", productId.toString());
        formData.append("price", price.toString());
        formData.append("factoryId", factoryId.toString());
        formData.append("availableFromLevel", availableFromLevel.toString());
        formData.append("takeEnergyCollect", takeEnergyCollect.toString());
        formData.append("xpOnCollect", xpOnCollect.toString());
        formData.append("ingredients", JSON.stringify(ingredients));

        if (values.icon) {
            formData.append("icon", values.icon);
        }


        try {

            const data = await saveRecipesRequest(formData);

            if ("error" in data) {
                setError(data.error as string);
            } else {

                values.productId = 0
                values.title = ""
                values.price = 0
                values.xpOnCollect = 1
                values.takeEnergyCollect = 1
                values.availableFromLevel = 1
                values.ingredientsCount = 0
            }
            cb()
            setDisableBtn(false);

            await handleGetRecipe(id);

        } catch (err) {

            setDisableBtn(false);

            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || "Login failed");
            }
        }
    };


    const handleAddNewIngredient = () => {
        setIngredients((prevIngredients) => [
            ...prevIngredients,
            createIngredientFormItem(Date.now()),
        ]);
    }

    const handleRemoveIngredient = (clientId: number) => {
        setIngredients((prevIngredients) =>
            prevIngredients.filter((ingredient) => ingredient.clientId !== clientId)
        );
    }

    const handleUpdateIngredient = (clientId: number, values: IngredientTypes) => {
        setIngredients((prevIngredients) =>
            prevIngredients.map((ingredient) =>
                ingredient.clientId === clientId
                    ? {
                        ...ingredient,
                        ...values,
                    }
                    : ingredient
            )
        );
    }

    if (loading) {
        return <Loader/>;
    }
    return (
        <div className={"form-container"}>

            {error && <Alerts text={error} type={AlertEnums.danger} cb={() => {
                setError(null)
            }}/>}
            {success && <Alerts text={success} type={AlertEnums.success} cb={() => {
                setSuccess(null)
            }}/>}

            <div>

                <Formik
                    enableReinitialize
                    initialValues={{
                        title: recipe?.recipe?.title || "",
                        productId: recipe?.recipe?.productId || 0,
                        price: recipe?.recipe?.price || 1,
                        factoryId: recipe?.recipe?.factoryId || 0,
                        availableFromLevel: recipe?.recipe?.availableFromLevel || 1,
                        icon: null,
                        xpOnCollect: recipe?.recipe?.xpOnCollect || 1,
                        takeEnergyCollect: recipe?.recipe?.takeEnergyCollect || 1,
                        ingredientsCount: ingredients.length,
                    }}
                    validationSchema={validateSchema}
                    onSubmit={handleSubmit}
                >
                    {({setFieldValue}) => (
                        <Form>

                            <div className="input-row">
                                <label htmlFor="email">Product</label>
                                <Field as="select" name="productId" id="productId">
                                    {products.map(products => (
                                        <option value={products.id}
                                                key={products.id}>{products.title}</option>
                                    ))}

                                </Field>
                                <ErrorMessage name="productId" component="div" className="error-msg"/>
                            </div>



                            <div className="input-row">
                                <label htmlFor="title">Title</label>
                                <Field type="text" id="title" name="title" placeholder="Title"/>
                                <ErrorMessage name="title" component="div" className="error-msg"/>
                            </div>

                            <div className="input-row">
                                <label htmlFor="price">Price</label>
                                <Field type="number" id="price" name="price" placeholder="Price"/>
                                <ErrorMessage name="price" component="div" className="error-msg"/>
                            </div>

                            <div className="input-row">
                                <label htmlFor="factoryId">Factory</label>
                                <Field as="select" name="factoryId" id="factoryId">
                                    <option value={0}
                                            key={-1}>Select factory
                                    </option>
                                    {factories && factories.map(factoryItem => {
                                        return (
                                            <option value={factoryItem.id}
                                                    key={factoryItem.id}>{capitalize(factoryItem.title)}</option>
                                        )
                                    })}
                                </Field>
                                <ErrorMessage name="factoryId" component="div" className="error-msg"/>
                            </div>

                            <div className="input-row">
                                <label htmlFor="availableFromLevel">Available From Level</label>
                                <Field type="number" id="availableFromLevel" name="availableFromLevel"
                                       placeholder="Available From Level"/>
                                <ErrorMessage name="availableFromLevel" component="div" className="error-msg"/>
                            </div>

                            <div className="input-row">
                                <label htmlFor="xpOnCollect">XP On Collect</label>
                                <Field type="number" id="xpOnCollect" name="xpOnCollect"
                                       placeholder="XP On Collect"/>
                                <ErrorMessage name="xpOnCollect" component="div" className="error-msg"/>
                            </div>

                            <div className="input-row">
                                <label htmlFor="takeEnergyCollect">Take Energy Collect</label>
                                <Field type="number" id="takeEnergyCollect" name="takeEnergyCollect"
                                       placeholder="Take Energy Collect"/>
                                <ErrorMessage name="takeEnergyCollect" component="div" className="error-msg"/>
                            </div>


                            <div className={"image-container"}>
                                <div className="input-row">
                                    <label htmlFor="icon">Icon</label>
                                    <input
                                        type="file"
                                        id="icon"
                                        name="icon"
                                        onChange={(e) => {
                                            setFieldValue("icon", e.currentTarget.files?.[0]);
                                        }}
                                    />
                                    <ErrorMessage name="icon" component="div" className="error-msg"/>
                                </div>

                                {recipe?.recipe?.icon &&
                                    <div className={'data-image thumbnail m-b-2'}>
                                        <img src={import.meta.env.VITE_API_URL + recipe?.recipe?.icon} alt=""
                                             style={{width: '200px'}}/>
                                    </div>
                                }
                            </div>
                            <div className="input-row">
                                <button type={'submit'} disabled={disableBtn} className={'btn green'}>Save</button>
                            </div>

                            <div>
                                <h3 className={"mb-20"}>Recipe ingredients</h3>


                                <div className="input-row">
                                    <Field type="number" id="ingredientsCount" name="ingredientsCount"
                                           style={{display: 'none'}}/>
                                    <ErrorMessage name="ingredientsCount" component="div" className="error-msg"/>
                                </div>

                                <div className={'recipe-ingredient-component-list'}>
                                    {ingredients.map((ingredient) => (
                                        <RecipeIngredientComponent
                                            key={ingredient.clientId}
                                            recipeId={id}
                                            id={ingredient.id || ingredient.clientId}
                                            cb={(ingredientValues) => {
                                                handleUpdateIngredient(ingredient.clientId, ingredientValues);
                                            }}
                                            remove={() => {
                                                handleRemoveIngredient(ingredient.clientId);
                                            }}
                                            addedIngredient={ingredient}
                                        />
                                    ))}
                                </div>


                                <div className="input-row">
                                    <button type={'button'} onClick={() => handleAddNewIngredient()}
                                            className={'btn info'}>Add new Ingredient
                                    </button>
                                </div>

                            </div>

                        </Form>
                    )}
                </Formik>

            </div>
        </div>
    )
}
