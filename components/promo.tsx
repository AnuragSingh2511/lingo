

import Image from "next/image"
import { Button } from "./ui/button"
import Link from "next/link"

export const Promo = () => {

    return (
        <div className="border-2 rounded-xl p-4 space-y-4">
            <div className="space-y-2">
             <div className="flex items-center gap-x-2">
                <Image 
                src="/unlimited.svg"
                width={26}
                height={26}
                alt="promo"
                className="rounded-xl"
                />
                <h3 className="font-bold text-lg">
                    Upgrade to more hearts
                </h3>

             </div>
             <p className="text-muted-foreground p-4">
                Learn with your heart!
             </p>
            </div>
            
            <Button
            asChild
            variant="super"
            className="w-full"
            size="lg"
            > 
            <Link href="/shop">
                Upgrade today
                </Link>
            </Button>
            

        </div>
    )
}