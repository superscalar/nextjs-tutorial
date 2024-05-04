import EditInvoiceForm from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
 
export default async function Page( {params}: { params: { id: string} }) {
	const editId = params.id;
	const [invoice, customers] = await Promise.all([
		fetchInvoiceById(editId),
		fetchCustomers(),
	]);

	// console.log("Invoice --->", invoice);
	// console.log("Customers --->", customers); // isn't it inefficient to fetch them all? It's needed for the form, though

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
