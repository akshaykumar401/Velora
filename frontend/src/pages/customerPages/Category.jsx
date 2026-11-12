import { useAppSelector } from '../../App/hooks.js'
import {
  CategoryHero,
  CategoryMaterialsBanner,
  CategoryShowcaseGrid,
} from '../../components/category'
import { ATELIER_MATERIALS } from '../../data/editorialData.js'

const Category = () => {
  const categories = useAppSelector((state) => state.catalog.categories)

  return (
    <>
      <CategoryHero />
      <CategoryShowcaseGrid categories={categories} />
      <CategoryMaterialsBanner materials={ATELIER_MATERIALS} />
    </>
  )
}

export default Category
