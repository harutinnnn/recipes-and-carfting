import './Header.css'

export const Header = () => {


    return (
        <header>

            <div className={"user-avatar"}>
                <img src="/public/images/avatars/avatar-dino.png" alt=""/>
            </div>

            <div className="user-level">
                LVL 1
            </div>


            <div className="user-money-info">

                <div className="game-money">
                    <span>
                        1.2 K
                    </span>
                    <img src="/public/images/icons/game-money.png" alt=""/>
                </div>

                <div className="real-money">
                    <span>47</span>
                    <img src="/public/images/icons/real-mone.png" alt=""/>
                </div>
            </div>


        </header>
    )
}