import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import 'react-tabs/style/react-tabs.css';
import {useEffect, useState} from "react";
import {getUserFoods, getUserProducts, getUserSeeds} from "@/api/main.api";
import {UserSeedTypeJoin} from "@/types/UserSeedsType";
import {UserProductTypeJoin} from "@/types/UserProductType";
import {sellUserProduct, sellUserProductAll, useFood} from "@/api/market.api";
import toast from "react-hot-toast";
import {useAuth} from "@/hooks/useAuth";
import {FoodType, FoodTypeJoin} from "@/types/FoodType";

export const UserInventoryComponent = ({cb}: { cb: () => void }) => {
    const {refreshUser} = useAuth();

    const [userSeeds, setUserSeeds] = useState<UserSeedTypeJoin[]>([]);
    const [userProducts, setUserProducts] = useState<UserProductTypeJoin[]>([]);
    const [userFoods, sertUserFoods] = useState<FoodTypeJoin[]>([]);

    useEffect(() => {
        (async () => {
            await getInventoryItems()
        })()
    }, [setUserSeeds, setUserProducts])

    const getInventoryItems = async () => {
        const data = await getUserSeeds()
        setUserSeeds(data.items)

        const productsData = await getUserProducts()
        setUserProducts(productsData.items)

        const foodsData = await getUserFoods()
        sertUserFoods(foodsData.items)
    }


    const sellProduct = async (productId: number, all: boolean = false) => {

        let data = null;
        if (all) {
            data = await sellUserProductAll(productId)
        } else {
            data = await sellUserProduct(productId)
        }

        if ("error" in data) {
            toast.error(data?.error + "")
        } else {
            toast.success('The product successfully sell!')
            await getInventoryItems()
            await refreshUser();
        }
    }

    const handleUseFood = async (foodId: number) => {

        const data = await useFood(foodId)

        if ("error" in data) {
            toast.error(data?.error + "")
        } else {
            toast.success('The product successfully sell!')
            await getInventoryItems()
            await refreshUser();
        }

    }

    return (
        <div className={"user-inventory"}>


            <div>
                <Tabs>
                    <TabList>
                        <Tab>Seeds</Tab>
                        <Tab>Products</Tab>
                        <Tab>Recipes</Tab>
                        <Tab>Foods</Tab>
                    </TabList>

                    <TabPanel>
                        <h3>Seeds</h3>
                        <div className="user-inventory-seeds inventory-items">
                            {userSeeds && userSeeds.map(seed => {
                                return (
                                    <div className={"inventory-item"} key={seed.seeds.id}>
                                        <img src={import.meta.env.VITE_API_URL + seed.seeds.icon}
                                             style={{width: '100px'}}
                                             alt=""/>
                                        {seed.seeds.title} ({seed.userSeeds.count})
                                    </div>
                                )
                            })}
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <h3>Products</h3>
                        <div className="user-inventory-products inventory-items">


                            {userProducts && userProducts.map(product => {
                                return (
                                    <div className={"inventory-item"} key={product.seeds.id}>
                                        <img src={import.meta.env.VITE_API_URL + product.seeds.readyProductImage}
                                             style={{width: '100px'}}
                                             alt=""/>

                                        <div>{product.seeds.title} - {product.userProducts.count}</div>

                                        {product.userProducts.count ?
                                            <>
                                                <button className={"btn green sm sell-product-btn w-100"}
                                                        onClick={() => {
                                                            void sellProduct(product.userProducts.id)
                                                        }}>
                                                    Sell
                                                </button>
                                                <button className={"btn green sm sell-product-btn w-100"}
                                                        onClick={() => {
                                                            void sellProduct(product.userProducts.id, true)
                                                        }}>
                                                    Sell All
                                                </button>
                                            </> : ""}

                                    </div>
                                )
                            })}
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="user-inventory-recipes">
                            Recipes
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="user-inventory-recipes">
                            <h3>Foods</h3>

                            <div className="user-inventory-products inventory-items">


                                {userFoods && userFoods.map(userFood => {
                                    return (
                                        <div className={"inventory-item"} key={userFood.foods.id}>
                                            <img src={import.meta.env.VITE_API_URL + userFood.foods.icon}
                                                 style={{width: '100px'}}
                                                 alt=""/>

                                            <div>{userFood.foods.title} - {userFood.userFoods.count}</div>

                                            {userFood.userFoods.count ?
                                                <button className={"btn green sm sell-product-btn w-100"}
                                                        onClick={() => {
                                                            void handleUseFood(userFood.userFoods.id)
                                                        }}>
                                                    Use
                                                </button> : ""}

                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </TabPanel>
                </Tabs>
            </div>

        </div>
    )
}