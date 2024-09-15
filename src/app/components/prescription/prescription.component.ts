import { CommonModule } from "@angular/common";
import { Component, Input } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { IMAGES } from 'src/app/core/constants/images.constant';
import { Prescription } from "src/app/core/dtos/prescription.dto";

@Component({
  selector: 'app-prescription',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],
})
export class PrescriptionComponent {
  @Input() prescription!: Prescription;
  public images = IMAGES;
  public pdfVisible = false; // Control visibility of PDF content

  async downloadPDF() {
    const data = document.getElementById('pdf-content');
    if (!data) {
        console.error('Element with id "pdf-content" not found.');
        return;
    }

    // Make the content visible for capturing
    data.style.visibility = 'visible'; // Show the PDF content

    // Wait a moment to ensure the DOM is updated
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        const canvas = await html2canvas(data);
        const imgWidth = 208; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        let heightLeft = imgHeight;
        let position = 0;

        // Add image to PDF
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Handle multi-page content
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save('Prescription.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error);
    } finally {
        // Hide the content after PDF is generated
        data.style.visibility = 'hidden'; // Hide the PDF content again
    }
}
}
