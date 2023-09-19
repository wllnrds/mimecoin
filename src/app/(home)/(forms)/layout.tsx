import Footer from "@/app/(home)/footer"
import Header from "./header"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
		<div className="bg-primary flex-1 flex flex-col">
            <Header />
            <div className=" rounded-t-[40px] flex-1 flex flex-col bg-white overflow-clip">
                { children }
                <div className="h-20"></div>
            </div>
            <Footer />
        </div>
    )
}