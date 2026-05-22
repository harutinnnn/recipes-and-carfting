import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import 'react-tabs/style/react-tabs.css';
import {useEffect, useState} from "react";
import {getUserProducts, getUserSeeds} from "@/api/main.api";
import {UserSeedTypeJoin} from "@/types/UserSeedsType";
import {UserProductTypeJoin} from "@/types/UserProductType";
import {sellUserProduct} from "@/api/market.api";
import toast from "react-hot-toast";
import {useAuth} from "@/hooks/useAuth";

export const UserInventoryComponent = ({cb}: { cb: () => void }) => {
    const {refreshUser} = useAuth();

    const [userSeeds, setUserSeeds] = useState<UserSeedTypeJoin[]>([]);
    const [userProducts, setUserProducts] = useState<UserProductTypeJoin[]>([]);

    const getInventoryItems = async () => {
        const data = await getUserSeeds()
        setUserSeeds(data.items)


        const productsData = await getUserProducts()
        setUserProducts(productsData.items)
    }

    useEffect(() => {
        (async () => {
            await getInventoryItems()
        })()
    }, [setUserSeeds, setUserProducts])




    const sellProduct = async (productId: number) => {


        const data = await sellUserProduct(productId)

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

                                        <button className={"btn green sm sell-product-btn"} onClick={() => {
                                            void sellProduct(product.userProducts.id)
                                        }}>
                                            Sell
                                        </button>

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