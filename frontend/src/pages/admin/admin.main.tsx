import './Admin.css'
import {BarChart} from "@/components/admin/chrts/BarChart";
import {LineChart} from "@/components/admin/chrts/LineChart";

export const AdminMain = () => {

    return (
        <div>
            <div className="admin-wrap">

                <h2 style={{color: "#fff"}}>Dashboard</h2>


                <div className={"grid-2"}>
                    <BarChart/>
                    <LineChart/>
                </div>

            </div>
        </div>
    )
}