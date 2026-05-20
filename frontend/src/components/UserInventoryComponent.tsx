import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import 'react-tabs/style/react-tabs.css';
import {useEffect, useState} from "react";
import {getUserProducts, getUserSeeds, UserSeedsResponseJoin} from "@/api/main.api";
import {UserSeedTypeJoin} from "@/types/UserSeedsType";
import {UserProductTypeJoin} from "@/types/UserProductType";

export const UserInventoryComponent = ({cb}: { cb: () => void }) => {

    const [userSeeds, setUserSeeds] = useState<UserSeedTypeJoin[]>([]);
    const [userProducts, setUserProducts] = useState<UserProductTypeJoin[]>([]);

    useEffect(() => {
        (async () => {
            const data = await getUserSeeds()
            setUserSeeds(data.items)


            const productsData = await getUserProducts()
            setUserProducts(productsData.items)
        })()
    }, [setUserSeeds,setUserProducts])

    return (
        <div className={"user-inventory"}>


            <div>
                <Tabs>
                    <TabList>
                        <Tab>Seeds</Tab>
                        <Tab>Products</Tab>
                        <Tab>Recipes</Tab>
                    </TabList>

                    <TabPanel>
                        <div className="user-inventory-seeds">
                            Seeds
                            <div>
                                {userSeeds && userSeeds.map(seed => {
                                    return (
                                        <div>
                                            {seed.seeds.title} - {seed.userSeeds.count}
                                            <img src={import.meta.env.VITE_API_URL + seed.seeds.icon}
                                                 style={{width: '100px'}}
                                                 alt=""/>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="user-inventory-products">
                            Products

                            {userProducts && userProducts.map(product => {
                                return (
                                    <div>
                                        {product.seeds.title} - {product.userProducts.count}
                                        <img src={import.meta.env.VITE_API_URL + product.seeds.readyProductImage}
                                             style={{width: '100px'}}
                                             alt=""/>
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
                </Tabs>
            </div>

        </div>
    )
}