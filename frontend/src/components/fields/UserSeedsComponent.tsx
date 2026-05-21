import {useEffect, useState} from "react";
import {UserSeedTypeJoin} from "@/types/UserSeedsType";
import {getUserSeeds} from "@/api/main.api";

export const UserSeeds = ({cb}: { cb: (userSeed: UserSeedTypeJoin) => void }) => {


    const [userSeeds, setUserSeeds] = useState<UserSeedTypeJoin[]>([])


    useEffect(() => {

        (async () => {
            const data = await getUserSeeds()
            setUserSeeds(data.items)
        })()

    }, [setUserSeeds])

    return (
        <div>
            <h3>Seeds</h3>

            <div className={"user-seeds-list"}>
                {userSeeds && userSeeds.map(userSeed => {
                    return (
                        <div className={"user-seed"} onClick={() => cb(userSeed)} key={userSeed.userSeeds.id}>
                            <img className={"user-seed-icon"} src={import.meta.env.VITE_API_URL + userSeed.seeds.icon}
                                 alt=""/>
                            <div className={"user-seed-info"}>{userSeed.seeds.title} ({userSeed.userSeeds.count})</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}