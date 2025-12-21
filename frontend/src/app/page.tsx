import Image from "next/image";
import CarousselProducts from "./ui/components/carousselProducts";
import ListDiscountsProducts from "./ui/components/listDiscountsProducts";
import ListProducts from "./ui/components/listProducts";
import ListCategories from "./ui/components/listCategories";

export default function Home() {
  return (
    <>
      <CarousselProducts />
      <ListDiscountsProducts />
      <ListProducts />
      <ListCategories />
    </>
  );
}
