import { data as items } from "@/data/item";
import ReviewForm from "@/components/Item/Review";
import { notFound } from "next/navigation";

type ReviewPageProps = {
	params: {
		itemId: string;
	};
};

export default function ReviewPage({ params }: ReviewPageProps) {
	const { itemId } = params;

	// Find the matching item
	const item = items.find((item) => item.id === itemId);

	if (!item) return notFound();

	return <ReviewForm item={item} />;
}
