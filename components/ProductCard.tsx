"use client";
import { useUser } from "@clerk/nextjs";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductCard({ product }: { product: ProductType }) {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [signedInUser, setSignedInUser] = useState<UserType | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const getUser = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user");
      const data = await res.json();
      setSignedInUser(data);
      setIsLiked(data.wishlist.includes(product._id));
      setLoading(false);
    } catch (error) {
      console.log("[user_GET]", error);
    }
  };
  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);
  const handleLike = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    try {
      if (!user) {
        router.push("/sign-in");
      } else {
        setLoading(true);
        const res = await fetch(`/api/user/wishlist`, {
          method: "POST",
          body: JSON.stringify({ productId: product._id }),
        });
        const updatedUser = await res.json();
        setSignedInUser(updatedUser);
        setIsLiked(updatedUser.wishlist.includes(product._id));
      }
    } catch (error) {
      console.log("[wishlist_POST]", error);
    }
  };
  return (
    <>
      <Image
        src={product.media[0]}
        alt={product.title}
        width={250}
        height={300}
        className="h-[250px] rounded-lg object-cover"
      />
      <div>
        <p className="text-base-bold">{product.title}</p>
        <p className="text-small-medium text-gray-2">{product.category}</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-body-bold">${product.price}</p>
        <button onClick={handleLike}>
          <Heart fill={`${isLiked ? "red" : "white"}`} />
        </button>
      </div>
    </>
  );
}
