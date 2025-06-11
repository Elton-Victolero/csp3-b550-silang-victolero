import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';

export default function Home() {

	const data ={
		title: "SV SHOPPING",
		content: "YOUR CART AWAITS YOU!",
		destination: "/products",
		buttonLabel: "START SHOPPING"
	}

	return (
		<>
			<Banner data={data}/>
			<FeaturedProducts/>
		</>
	)
}