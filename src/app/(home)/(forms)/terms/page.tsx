import { Metadata } from 'next'

export const metadata: Metadata = {
	title: "Termos de uso"
}

export default async function Terms() {
	return <div className='flex-1 flex flex-col items-center'>
		<section className='max-w-5xl flex flex-col gap-8 p-4'>
			<header>
				<h2 className='text-[3rem] text-center pt-6 font-black'>TERMOS DE USO</h2>
				<div className='text-center text-[1.2rem]'>Última atualização <time>19 de setembro de 2023</time></div>
			</header>
			<article className='space-y-6 mx-4 text-[1rem] font-light'>
				<p>Estes Termos de Uso ("Termos") regem o uso da plataforma <strong className='font-bold'>Mimecoin</strong> ("Produto"). Mimecoin é uma plataforma de <em>Token as a Service</em> que movimenta tokens virtuais com validade apenas para a plataforma. Ao acessar ou utilizar o Produto, você ("Usuário") concorda com os seguintes termos e condições.</p>

				<div className='space-y-2'>
					<h3 className='text-[1.5rem]'>Conta do usuário</h3>					
					<p>A Plataforma concede ao Usuário uma licença pessoal, não exclusiva e não transferível para usar o Produto, sujeita a estes Termos. O Produto é disponibilizado gratuitamente no momento, mas a Plataforma se reserva o direito de modificar sua política de preços e limitações de uso a qualquer momento.</p>
					<p>Para utilizar o Produto, o Usuário deve fornecer informações precisas, incluindo nome, endereço de e-mail e data de nascimento. O Usuário concorda em manter suas informações de registro atualizadas e precisas.</p>
					<ul className='list-item list-disc ml-6'>
						<li>Você deve ser um humano. Contas identificadas como "bots" ou outros métodos automátizados não são permitidas.</li>
						<li>Você deve usar um e-mail válido.</li>
						<li>Você é responsável pela segurança da sua conta, senha e tokens. Mimecoin não será responsável por qualquer perda ou dano resultante do não cumprimento das suas obrigações de segurança.</li>
						<li>Uma pessoa ou instituição não deve manter mais de uma conta gratúita.</li>
						<li>Você não deve usar Mimecoin para qualquer atividade ilegal ou propósito não autorizado. Você não deve, ao usar Mimecoin, violar qualquer lei ou jurisdição.</li>
					</ul>
				</div>

				<div className='space-y-2'>
					<h3 className='text-[1.5rem]'>Coleta e Uso de Dados</h3>
					<p>A Plataforma coleta e armazena os dados fornecidos pelo Usuário, incluindo nome, endereço de e-mail e data de nascimento, estritamente para fins de operação do Produto e comunicação com o Usuário.</p>
					<p>A Plataforma não utilizará os dados do Usuário para fins comerciais, nem compartilhará essas informações com terceiros para tais finalidades.</p>
					<p>A Plataforma reserva-se o direito de entrar em contato com o Usuário exclusivamente por e-mail, a fim de fornecer informações sobre possíveis novidades ou alertas relacionados ao uso do Produto. O Usuário pode optar por não receber comunicações futuras por e-mail a qualquer momento, seguindo as instruções de cancelamento de inscrição fornecidas nas mensagens de e-mail ou entrando em contato com a Plataforma.</p>
				</div>

				<div className='space-y-2'>
					<h3 className='text-[1.5rem]'>Indisponibilidade</h3>
					<p>O Produto pode ficar indisponível temporariamente, sem aviso prévio, devido a manutenção, atualizações ou problemas técnicos. A Plataforma não será responsável por qualquer inconveniência ou perda decorrente da indisponibilidade do Produto.</p>
				</div>

				<div className='space-y-2'>
					<h3 className='text-[1.5rem]'>Responsabilidade do Usuário</h3>
					<p>O Usuário concorda em usar o Produto de forma responsável e em conformidade com todas as leis aplicáveis. A Plataforma não se responsabiliza pelo uso indevido, abusivo ou ilegal do Produto por parte do Usuário.</p>
					<p>Plataforma pode permitir que o Usuário realize transações com dinheiro virtual no Produto. O Usuário é inteiramente responsável por todas as transações realizadas com dinheiro virtual, incluindo aquelas que possam ser consideradas indevidas ou abusivas. A Plataforma não é responsável por quaisquer transações realizadas pelo Usuário e não garante a integridade ou segurança dessas transações.</p>
				</div>

				<div className='space-y-2'>
					<h3 className='text-[1.5rem]'>Violação dos Termos</h3>
					<p>O Usuário compreende que a violação destes Termos pode levar a uma investigação por parte da Plataforma. A Plataforma reserva-se o direito de cooperar com as autoridades legais, fornecendo informações relacionadas à violação dos Termos, se necessário.</p>
					<p>A Plataforma se reserva o direito de modificar estes Termos a qualquer momento. As modificações entrarão em vigor imediatamente após sua publicação. O uso contínuo do Produto após a publicação das alterações constitui a aceitação dos novos Termos.</p>
				</div>

				<div className='space-y-2'>
					<h3 className='text-[1.5rem]'>Encerramento</h3>
					<p>A Plataforma pode encerrar a licença do Usuário para o Produto a qualquer momento, com ou sem motivo. Após o término, o Usuário deve interromper o uso do Produto.</p>
				</div>

				<div className='space-y-2'>
					<h3 className='text-[1.5rem]'>Disposições Gerais</h3>
					<p>Estes Termos representam o acordo completo entre o Usuário e a Plataforma e substituem todos os acordos anteriores. Qualquer falha da Plataforma em fazer cumprir qualquer parte destes Termos não constituirá uma renúncia a seus direitos.</p>
				</div>

				<div className='space-y-2'>
					<p>Ao usar o Produto, o Usuário concorda com estes Termos de Uso. Se você não concordar com esses termos, não use o Produto. Em caso de dúvidas ou preocupações, entre em contato com a Plataforma através dos canais de suporte fornecidos.</p>
				</div>
			</article>
		</section>
	</div>
}