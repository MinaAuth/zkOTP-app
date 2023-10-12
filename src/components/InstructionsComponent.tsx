import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";
export default function InstructionsComponent() {
	const router = useRouter();
	return (
		<div className={styles.container}>
			<header className={styles.header_container}>
				<h1>
					Create<span> Mina Frontend with Auro Wallet </span>
				</h1>
				<h3 className="text-[24px] p-4 mb-10 ">By <span>0xShikhar</span> </h3>

				<p>
					Get started by editing this page in{" "}
					<span>/pages/index.js</span>
				</p>
			</header>


		</div>
	);
}
