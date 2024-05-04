'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


/*
export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid';
};
*/

const FormSchema = z.object( {
	id: z.string(),
	customerId: z.string(),
	amount: z.coerce.number(),
	status: z.enum(['paid', 'pending']),
	date:  z.string(),
});

const ClientInvoiceDataSchema = FormSchema.omit({id: true, date: true});
const UpdateInvoiceDataSchema = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
	// const rawFormData = Object.fromEntries(formData.entries()); // next adds its own hidden ACTION_ID parameter
	// console.log(rawFormData);
	// const { customerId, amount, status } = ClientInvoiceDataSchema.parse(rawFormData);
	
	const { customerId, amount, status } = ClientInvoiceDataSchema.parse({
		customerId: formData.get('customerId'),
		amount: formData.get('amount'),
		status: formData.get('status'),
	  });
	console.log([customerId, amount, status]);
	
	// guaranteed to be at most two digits after the decimal point due to the step attribute in the input
	const amountInCents = amount*100;
	
	const invoiceDate = new Date().toISOString().split("T")[0]; // yields YYYY-MM-DD from a string that originally was YYYY-MM-DDT<hour>
	
	// console.log("sql\`" + `INSERT INTO invoices (customer_id, amount, status, date) values (${customerId}, ${amountInCents}, ${status}, ${invoiceDate});` + "\`");
	try {
		await sql`INSERT INTO invoices (customer_id, amount, status, date) values (${customerId}, ${amountInCents}, ${status}, ${invoiceDate});`;
	} catch (error) {
		return { message: "Database error: Failed to create invoice" /*, error: error */};
	}
	
	revalidatePath("/dashboard/invoices/");
	redirect("/dashboard/invoices/");
}


export async function updateInvoice(id: string, formData: FormData) {
	const { customerId, amount, status } = UpdateInvoiceDataSchema.parse({
		customerId: formData.get('customerId'),
		amount: formData.get('amount'),
		status: formData.get('status'),
	});

	const amountInCents = amount * 100;
	
	// console.log("await sql\`" + `UPDATE invoices SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status} WHERE id = ${id};` + "\`");
	
	try {	
		await sql`UPDATE invoices
			SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
			WHERE id = ${id};`;

	} catch (error) {
		return { message: "Database error: Failed to update invoice" /*, error: error */};		
	}
	
	revalidatePath('/dashboard/invoices');
	redirect('/dashboard/invoices'); // can throw an error too
	// obviously, can't return because anything after the redirect is unreachable
}

export async function deleteInvoice(id: string) {
	throw new Error("...");

	try {
		await sql`DELETE FROM invoices WHERE id = ${id}`;
		revalidatePath('/dashboard/invoices');
		return { message: "Succesfully deleted invoice" };
	} catch (error) {
		return { message: "Database error: Failed to delete invoice" /*, error: error */};
	}
}