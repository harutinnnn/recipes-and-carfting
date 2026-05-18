import {useEffect, useState} from "react";
import {getSeeds} from "@/api/admin/admin.seeds.api";
import {SeedType} from "@/types/UserSeedsType";
import {PencilLine, Trash2} from "lucide-react";

export const AdminSeeds = () => {


    const [seeds, setSeeds] = useState<SeedType[]>([]);


    useEffect(() => {
        (async () => {
            await handleGetSeeds();
        })()
    }, [setSeeds])

    const handleGetSeeds = async () => {
        const seeds = await getSeeds()
        setSeeds(seeds.items)
    }

    return (
        <div>
            <h1 className="admin-content-title">Seeds
                <span>Seeds</span>
                <button className={"btn info sm right-side"}>Add</button>
            </h1>


            <div className={"items-list"}>
                <table>
                    <thead>
                    <tr>
                        <th>
                            Title
                        </th>
                        <th>Price</th>
                        <th>Available from level</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    {seeds && seeds.map(seed => {
                        return (
                            <tr>
                                <td>{seed.title}</td>
                                <td>{seed.price}</td>
                                <td>{seed.availableLevel}</td>
                                <td>
                                    <div className="quick-actions">
                                        <Trash2 size={22} className="delete"/>
                                        <PencilLine size={22} className="edit"/>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}

                </table>
            </div>
        </div>
    )
}