import {useEffect, useState} from "react";
import {Trash2} from "lucide-react";
import {SeedProgressImageType} from "@/types/UserSeedsType";

export const FileUploadComponent = (
    {progressImage, cb}:
    { progressImage: SeedProgressImageType | null | undefined, cb: (file: File) => void }) => {


    const [fileSrc, setFileSrc] = useState<string | null>("/public/assets/icons/image.png")

    useEffect(() => {
        if (progressImage) {
            setFileSrc(import.meta.env.VITE_API_URL + progressImage)
        }
    }, [])

    return (
        <>
            <div className="file-upload-container">
                {fileSrc && <Trash2 size={22} className="delete"/>}
                {fileSrc && <img src={fileSrc}/>}
                <input
                    type="file"
                    id="progressImage"
                    name="progressImage"
                    multiple={true}
                    onChange={(e) => {

                        if (e.currentTarget.files) {
                            cb(e.currentTarget.files[0])
                            setFileSrc(URL.createObjectURL((e.currentTarget.files[0])))
                        }

                    }}
                />
            </div>

        </>
    )
}