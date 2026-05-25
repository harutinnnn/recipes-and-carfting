import {useEffect, useState} from "react";
import {PencilLine, Trash2} from "lucide-react";
import {MyModal} from "@/components/admin/MyModal";
import {AddFoodComponent} from "@/pages/admin/foods/AddFoodComponent";
import {ProductType} from "@/types/ProductType";
import {getProducts} from "@/api/admin/admin.products.api";
import {AddProductComponent} from "@/pages/admin/products/AddProductComponent";

export const AdminProducts = () => {

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [itemId, setItemId] = useState<number>(0);

    const [products, setProducts] = useState<ProductType[]>([]);

    const handleGetProducts = async () => {
        const seeds = await getProducts()
        setProducts(seeds.items)
    }

    useEffect(() => {
        (async () => {
            await handleGetProducts();
        })()
    }, [setProducts])


    const handleCLoseModal = () => {
        console.log("handleCLoseModal");
    }

    return (
        <div>
            <h1 className="admin-content-title">Seeds
                <span>Products</span>
                <button className={"btn info sm right-side"} onClick={() => {
                    setIsOpenModal(!isOpenModal)
                    setItemId(0);
                }}>Add
                </button>
            </h1>


            <div className={"items-list"}>
                <table>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Icon</th>
                        <th>Type</th>

                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {products && products.map(product => {
                        return (
                            <tr key={product.id}>
                                <td>{product.title}</td>
                                <td>
                                    <img src={import.meta.env.VITE_API_URL + product.icon} alt=""
                                         className={"img-list-thumbnail"}/>
                                </td>
                                <td>{product.userProductTypes}</td>
                                <td>
                                    <div className="quick-actions">
                                        <Trash2 size={22} className="delete"/>
                                        <PencilLine size={22} className="edit" onClick={() => {
                                            setIsOpenModal(!isOpenModal)
                                            setItemId(product.id);
                                        }}/>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>

                </table>
            </div>

            <MyModal
                afterOpen={() => {
                    handleCLoseModal();
                }} openModal={isOpenModal}
                closedModal={() => setIsOpenModal(false)}
                contend={<AddProductComponent id={itemId} cb={() => {
                    void handleGetProducts()
                    setIsOpenModal(false)
                }}/>}
            />
        </div>
    )
}