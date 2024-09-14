import { Component } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CommonModule } from "@angular/common";
import { IMAGES } from 'src/app/core/constants/images.constant';

@Component({
  selector: 'app-prescription',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],
})
export class PrescriptionComponent {
  public images = IMAGES;
  public pdfVisible = false; // Control visibility of PDF content

  // Sample prescription data
  prescriptionData = {
    medicines: [
      {
        medicineName: "Paracetamol",
        saltName: "Acetaminophen",
        dosage: "500mg",
        description: "For fever and body ache",
        numberOfDays: "5"
      },
      {
        medicineName: "Dextromethorphan",
        saltName: "Dextromethorphan Hydrobromide",
        dosage: "15mg",
        description: "For cough suppression",
        numberOfDays: "7"
      }
    ],
    symptoms: "cough & fever & bodyache",
    precautions: [
      "Rest and stay hydrated",
      "Cover mouth when coughing",
      "Avoid close contact with others"
    ],
    dietPlan: [
      "Drink warm soups and broths",
      "Eat fruits rich in Vitamin C",
      "Consume warm herbal teas"
    ],
    homeRemedies: [
      "Gargle with warm salt water",
      "Use a humidifier",
      "Drink honey and lemon tea"
    ],
    description: "Common cold with fever and body ache",
    nearbyDoctors: [
      {
        doctorname: "Dr. Sharma",
        rating: "4.5",
        timings: "9:00 AM - 5:00 PM"
      },
      {
        doctorname: "Dr. Patel",
        rating: "4.2",
        timings: "10:00 AM - 6:00 PM"
      },
      {
        doctorname: "Dr. Singh",
        rating: "4.7",
        timings: "8:00 AM - 4:00 PM"
      },
      {
        doctorname: "Dr. Gupta",
        rating: "4.3",
        timings: "11:00 AM - 7:00 PM"
      },
      {
        doctorname: "Dr. Kumar",
        rating: "4.6",
        timings: "9:30 AM - 5:30 PM"
      }
    ]
  };
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
