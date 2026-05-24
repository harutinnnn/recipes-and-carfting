import {IngredientTypesEnum} from "@/enums/IngredientTypesEnum";
import {useEffect, useRef, useState} from "react";
import {ErrorMessage, Field, Form, Formik, useFormikContext} from "formik";
import * as Yup from "yup";
import {IngredientTypes} from "@/types/RecipesType";
import {saveRecipesRequest} from "@/api/admin/admin.recipes.api";
import {AxiosError} from "axios";
import {capitalize} from "@/helpers/text.helper";
import {Trash2} from "lucide-react";
import {getSeeds} from "@/api/admin/admin.seeds.api";
import {SeedType} from "@/types/UserSeedsType";

const IngredientCompleteWatcher = ({cb}: { cb: (ingredient: IngredientTypes) => void }) => {
    const {values} = useFormikContext<IngredientTypes>();
    const lastSavedValue = useRef<string | null>(null);

    useEffect(() => {
        const ingredient = {
            ...values,
            ingredientId: Number(values.ingredientId),
            ingredientNeedsCount: Number(values.ingredientNeedsCount),
        };
        const isComplete =
            ingredient.ingredientId > 0 &&
            Object.values(IngredientTypesEnum).includes(ingredient.ingredientType) &&
            ingredient.ingredientNeedsCount > 0;
        const nextSavedValue = JSON.stringify(ingredient);

        if (isComplete && lastSavedValue.current !== nextSavedValue) {
            lastSavedValue.current = nextSavedValue;
            cb(ingredient);
        }

        if (!isComplete) {
            lastSavedValue.current = null;
        }
    }, [values, cb]);

    return null;
};

export const RecipeIngredientComponent = ({cb, recipeId, id, remove}: {
    cb: (ingredient: IngredientTypes) => void,
    recipeId: number,
    id: number,
    remove: () => void,
}) => {

    const [error, setError] = useState<string | null>(null);

    const [ingredientTypes, setIngredientTypes] = useState<string[]>(Object.values(IngredientTypesEnum))

    const [ingredients, setIngredients] = useState<SeedType[]>([]);

    useEffect(() => {
        (async () => {
            await getIngredientByType(IngredientTypesEnum.VEGETABLE)
        })()
    }, [])
    const getIngredientByType = async (type: IngredientTypesEnum) => {

        switch (type) {
            case IngredientTypesEnum.VEGETABLE:

                const seeds = await getSeeds();
                setIngredients(seeds.items)
                break;
        }

    }

    useEffect(() => {
        console.log(Object.values(IngredientTypesEnum))
    }, [])


    const validateSchema = Yup.object({
        ingredientId: Yup.number().required("Ingredient type is required").moreThan(0, 'Ingredient type is required'),
        ingredientType: Yup.mixed<IngredientTypesEnum>()
            .oneOf(Object.values(IngredientTypesEnum), "Invalid Ingredient Type")
            .required("Ingredient Type is required"),
        ingredientNeedsCount: Yup.number().required("Ingredient Needs is required"),
    });

    const handleSubmit = async (values: IngredientTypes) => {

        setError(null);


        const ingredientId = values.ingredientId;
        const ingredientType = values.ingredientType;
        const ingredientNeedsCount = values.ingredientNeedsCount;

        const formData = new FormData();
        formData.append('id', id.toString())
        formData.append("recipeId", recipeId.toString());
        formData.append("ingredientId", ingredientId.toString());
        formData.append("ingredientType", ingredientType);
        formData.append("ingredientNeedsCount", ingredientNeedsCount.toString());


        try {

            const data = await saveRecipesRequest(formData);

            if ("error" in data) {
                setError(data.error as string);
            } else {

            }
            cb({
                id,
                recipeId,
                ingredientId,
                ingredientType,
                ingredientNeedsCount,
            })

        } catch (err) {

            if (err instanceof AxiosError) {

                setError(err.response?.data?.message || "Login failed");

            }

        }
    };


    return (
        <div className={"recipe-ingredinet-component"}>


            <Trash2 size={22} onClick={remove} className={"delete-ingredient"}/>

            <Formik

                enableReinitialize
                initialValues={{
                    ingredientId: 0,
                    ingredientType: IngredientTypesEnum.VEGETABLE,
                    ingredientNeedsCount: 0
                }}
                validationSchema={validateSchema}
                onSubmit={handleSubmit}
            >
                <Form>
                    <IngredientCompleteWatcher cb={cb}/>

                    <div className="input-row">
                        <label htmlFor="ingredientType">Factory</label>
                        <Field as="select" name="ingredientType" id="ingredientType">
                            {ingredientTypes && ingredientTypes.map(ingredientType => {
                                return (
                                    <option value={ingredientType}
                                            key={ingredientType}>{capitalize(ingredientType)}</option>
                                )
                            })}
                        </Field>
                        <ErrorMessage name="ingredientType" component="div" className="error-msg"/>
                    </div>

                    <div className="input-row">
                        <label htmlFor="ingredientId">Ingredient type</label>
                        <Field as="select" name="ingredientId" id="ingredientId">
                            <option value={0} key={-1}>{"Ingredient type"}</option>
                            {ingredients && ingredients.map(ingredient => {
                                return (
                                    <option value={ingredient.id} key={ingredient.id}>{ingredient.title}</option>
                                )
                            })}
                        </Field>
                        <ErrorMessage name="ingredientId" component="div" className="error-msg"/>
                    </div>


                    <div className="input-row">
                        <label htmlFor="ingredientNeedsCount">Ingredient Needs Count</label>
                        <Field type="number" id="ingredientNeedsCount" name="ingredientNeedsCount"
                               placeholder="Ingredient Needs Count"/>
                        <ErrorMessage name="ingredientNeedsCount" component="div" className="error-msg"/>
                    </div>

                </Form>
            </Formik>


        </div>
    )
}
