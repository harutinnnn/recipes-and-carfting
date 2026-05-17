import {OctagonX} from "lucide-react";

export const Alerts = ({text, type, cb}: { text: string, type: string, cb: () => void }) => {
    return (
        <div className={"alert " + type}>
            <span>{text}</span>
            <OctagonX size={16} type={type} onClick={cb}/>
        </div>
    )
}