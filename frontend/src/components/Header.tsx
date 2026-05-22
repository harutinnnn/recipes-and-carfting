import './Header.css'
import {useAuth} from "@/hooks/useAuth";
import {getPercent} from "@/helpers/user.progress.helper";
import {MyModal} from "@/components/admin/MyModal";
import {AddSeedComponent} from "@/pages/admin/seeds/AddSeedComponent";
import {useState} from "react";
import {UserInventoryComponent} from "@/components/UserInventoryComponent";
import {MarketComponent} from "@/components/MarketComponent";

export const Header = () => {

    const {user} = useAuth()

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenModalMarket, setIsOpenModalMarket] = useState(false);

    return (
        <header>

            <div className={"inner-header"}>

                <div className={"user-avatar"}>
                    <img src="/public/images/avatars/avatar-dino.png" alt=""/>
                </div>

                <div className="user-level">
                    LVL {user?.level ?? 1}
                </div>

                <div className={"flex flex-row gap-15"}>

                    <div className={"market-icon"} onClick={() => setIsOpenModalMarket(true)}>
                        <img src="/public/assets/icons/market-icon.png" alt=""/>
                    </div>

                    <div className={"user-inventory-icon"} onClick={() => setIsOpenModal(true)}>
                        <img src="/public/images/icons/inventory-256.png" alt=""/>
                    </div>

                </div>

                <div className="user-money-info">

                    <div className="user-energy">
                        <span>
                            {user?.energy ?? 0}
                        </span>
                        <img src="/public/assets/icons/energy-icon.png" alt=""/>
                    </div>
                    <div className="game-money">
                        <span>
                            {user?.gameMoney ?? 0}
                        </span>
                        <img src="/public/images/icons/game-money.png" alt=""/>
                    </div>

                    <div className="real-money">
                        <span>{user?.realMoney ?? 0}</span>
                        <img src="/public/images/icons/real-mone.png" alt=""/>
                    </div>
                </div>


            </div>
            <div className={"xp-lvl-progress"}>
                <div className={"progress-bar"}
                     style={{width: `${getPercent(Number(user?.xp), Number(user?.nextLevelXP))}%`}}></div>
            </div>

            <MyModal
                afterOpen={() => {}}
                openModal={isOpenModalMarket}
                closedModal={() => setIsOpenModalMarket(false)}
                contend={<MarketComponent/>}
            />

            <MyModal
                afterOpen={() => {}}
                openModal={isOpenModal}
                closedModal={() => setIsOpenModal(false)}
                contend={<UserInventoryComponent cb={() => {
                }}/>}
            />
        </header>
    )
}
