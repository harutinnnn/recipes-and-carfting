import './Header.css'
import {useAuth} from "@/hooks/useAuth";

export const Header = () => {


    const {user} = useAuth()

    return (
        <header>

            <div className={"user-avatar"}>
                <img src="/public/images/avatars/avatar-dino.png" alt=""/>
            </div>

            <div className="user-level">
                LVL {user?.level ?? 1}
            </div>


            <div className="user-money-info">

                <div className="game-money">
                    <span>
                        {user?.gameMoney ?? 0} K
                    </span>
                    <img src="/public/images/icons/game-money.png" alt=""/>
                </div>

                <div className="real-money">
                    <span>{user?.realMoney ?? 0}</span>
                    <img src="/public/images/icons/real-mone.png" alt=""/>
                </div>
            </div>


        </header>
    )
}
