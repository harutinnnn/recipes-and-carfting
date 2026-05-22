import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import 'react-tabs/style/react-tabs.css';
import {useEffect, useState} from "react";
import {buyFoodRequest, buySeed as buySeedRequest, getMarketItems} from "@/api/market.api";
import {MarketItemsType} from "@/types/market.types";
import {SeedType} from "@/types/UserSeedsType";
import toast from "react-hot-toast";
import {useAuth} from "@/hooks/useAuth";
import {FoodType} from "@/types/FoodType";

export const MarketComponent = () => {
    const {refreshUser} = useAuth();

    const [marketItems, setMarketItems] = useState<MarketItemsType | null>({
        seeds: [],
        products: [],
        recipes: [],
        food: []
    });

    useEffect(() => {
        (async () => {
            const data = await getMarketItems()
            setMarketItems(data.items)
        })()
    }, [])


    const handleBuySeed = async (seedId: number) => {

        const newSeed = await buySeedRequest(seedId)

        if ("error" in newSeed) {

            toast.error(newSeed?.error + "")
        } else {
            toast.success('Successfully buying seed')
            await refreshUser();
        }
    }


    const handleBuyFood = async (foodId: number) => {

        const data = await buyFoodRequest(foodId)

        if ("error" in data) {

            toast.error(data?.error + "")
        } else {
            toast.success('Successfully buying seed')
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
                        <Tab>Food</Tab>
                    </TabList>

                    <TabPanel>
                        <h3>Seeds</h3>
                        <div className="user-inventory-seeds inventory-items">
                            {marketItems?.seeds && marketItems.seeds.map((seed: SeedType) => {
                                return (
                                    <div className={"inventory-item"} key={seed.id}
                                         onClick={() => handleBuySeed(seed.id)}>
                                        <img src={import.meta.env.VITE_API_URL + seed.icon}
                                             style={{width: '100px'}}
                                             alt=""/>
                                        <div className={"flex flex-row gap-10 align-center"}>
                                            <span>{seed.title}</span>
                                            <span>|</span>
                                            <span className={'flex flex-row gap-5 align-center'}>
                                                {seed.price}:
                                                <img
                                                    src="/public/images/icons/game-money.png"
                                                    className={"game-money-icon"}
                                                    alt=""
                                                />
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <h3>Products</h3>
                        <div className="user-inventory-products inventory-items">


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
                            <div className="user-inventory-seeds inventory-items">
                                {marketItems?.food && marketItems.food.map((food: FoodType) => {
                                    return (
                                        <div className={"inventory-item"} key={food.id}
                                             onClick={() => handleBuyFood(food.id)}>
                                            <img src={import.meta.env.VITE_API_URL + food.icon}
                                                 style={{width: '100px'}}
                                                 alt=""/>
                                            <div className={"flex flex-row gap-10 align-center fs-14"}>
                                                <span>{food.title}</span>
                                                <span className={'flex flex-row gap-5 align-center'}>
                                                {food.price}
                                                    <img
                                                        src="/public/images/icons/game-money.png"
                                                        className={"game-money-icon"}
                                                        alt=""
                                                    />
                                            </span>
                                            </div>
                                            <div className={"flex flex-row gap-10 align-center fs-14"}>
                                                <span>Gives energy:</span>
                                                <span>{food.energyPower}</span>
                                            </div>
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
