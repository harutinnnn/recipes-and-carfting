import './Header.css'
import {useAuth} from "@/hooks/useAuth";
import {getPercent} from "@/helpers/user.progress.helper";

export const Header = () => {


    const {user} = useAuth()

    return (
        <header>

            <div className={"inner-header"}>

                <div className={"user-avatar"}>
                    <img src="/public/images/avatars/avatar-dino.png" alt=""/>
                </div>

                <div className="user-level">
                    LVL {user?.level ?? 1}
                </div>

                <div className={"user-inventory-icon"}>
                    <img src="/public/images/icons/inventory-256.png" alt=""/>
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

        </header>
    )
}
