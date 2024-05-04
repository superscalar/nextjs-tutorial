import EditInvoiceForm from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
 
export default async function Page( {params}: { params: { id: string} }) {
	const editId = params.id;
	const [invoice, customers] = await Promise.all([
		fetchInvoiceById(editId),
		fetchCustomers(),
	]);

	console.log("Invoice --->", invoice);
	// console.log("Customers --->", customers); // isn't it inefficient to fetch them all? It's needed for the form, though. common solutions are allowing search and pagination in a small customer selector, or sending a query just when the user types
	
	
	// []/undefined is falsey
	if (invoice == undefined) {
		console.log(">>> not found <<<");
		notFound();
	}

	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
				  { label: 'Invoices', href: '/dashboard/invoices' },
				  {
					label: 'Edit Invoice',
					href: `/dashboard/invoices/${editId}/edit`,
					active: true,
				  },
				]}
			/>
			
			<EditInvoiceForm invoice={invoice} customers={customers} />
		</main>
	);
}
