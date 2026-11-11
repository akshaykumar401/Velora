import {
  CategoryHero,
  CategoryMaterialsBanner,
  CategoryShowcaseGrid,
} from '../../components/category'
import { ATELIER_MATERIALS, CATEGORIES } from '../../data/catalogData.js'

const Category = () => {
  return (
    <>
      <CategoryHero />
      <CategoryShowcaseGrid categories={CATEGORIES} />
      <CategoryMaterialsBanner materials={ATELIER_MATERIALS} />
    </>
  )
}

export default Category
