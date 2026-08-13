# -*- coding: utf-8 -*-
"""Build updated student compilation PDF HTML from original content + curriculum syllabi."""
from html import escape
from pathlib import Path

OUT = Path(__file__).with_name("compilation.html")

NAVY = "#1e3a5f"
TEAL = "#2c5f6e"


def e(x):
    return escape(str(x)) if x is not None else ""


def info_table(rows):
    body = []
    for i, (k, v) in enumerate(rows):
        bg = "#f4f7fa" if i % 2 == 0 else "#ffffff"
        body.append(
            f'<tr><td style="width:38%;background:{bg};font-weight:600;color:#1e3a5f">{e(k)}</td>'
            f'<td style="background:{bg}">{e(v)}</td></tr>'
        )
    return (
        '<table class="info">'
        "<thead><tr><th>Official course information</th><th>Details</th></tr></thead>"
        f"<tbody>{''.join(body)}</tbody></table>"
    )


def week_table(headers, rows, note=None):
    th = "".join(f"<th>{e(h)}</th>" for h in headers)
    body = []
    for i, row in enumerate(rows):
        bg = "#f7f9fb" if i % 2 == 0 else "#ffffff"
        tds = "".join(f'<td style="background:{bg}">{e(c)}</td>' for c in row)
        body.append(f"<tr>{tds}</tr>")
    n = f'<p class="src">{e(note)}</p>' if note else ""
    return (
        f"{n}<table class='syl'><thead><tr>{th}</tr></thead>"
        f"<tbody>{''.join(body)}</tbody></table>"
    )


def kv_table(headers, rows, note=None):
    return week_table(headers, rows, note)


def course(title, info_rows, syllabus_html, marker=""):
    return f"""
<section class="course">
  <h3>{e(marker + ' ' if marker else '')}{e(title)}</h3>
  {info_table(info_rows)}
  <h4>Complete Detailed Syllabus</h4>
  {syllabus_html}
</section>
"""


SRC = "Source: University of Szeged, Albert Szent-Györgyi School of Medicine, Curriculum 2025/2026 (official syllabuses). Student grades, dates, ECTS and course codes are unchanged from the original compilation."
SRC_SPLIT = SRC + " Weekly lecture / dissection / histology columns taken from the combined Head, Neck and Neuroanatomy syllabus and assigned to the corresponding passed course."

# --- Anatomy already filled (kept from original compilation) ---
ANAT1_ROWS = [
    ["1", "Introduction to human anatomy: anatomical nomenclature, planes, directions, axes. General osteology. General syndesmology. Basic tissues, part 1: Epithelial tissues.", "Dissection: General information on the classes and exams. Injury preventive rules and dissecting room regulations. Bones of the upper limb. Histology: Use of light microscope. Introduction to histological methods. Interpretation of histological preparations."],
    ["2", "General myology. General angiology.", "Dissection: Joints of the upper limb. Cross-sectional anatomy of upper limb. Histology: Epithelial tissues, part 1: Kidney, Jejunum, Trachea."],
    ["3", "General neuroanatomy. Spinal cord segment. Formation of the plexuses from the spinal nerves. Basic tissues, part 2: Connecting and supporting tissues.", "Dissection: Muscles of the upper limb. Cross-sectional anatomy of upper limb. Histology: Epithelial tissues, part 2: Oesophagus, Finger pad, Unicellular gland, Submandibular gland."],
    ["4", "Nerves of the upper limb.", "Dissection: Blood vessels of the upper limb. Cross-sectional anatomy of upper limb. Histology: Connective tissues: Finger pad, Tendon, Adipose tissue, frozen adipose tissue."],
    ["5", "Functional anatomy of the upper limb. Basic tissues, part 3: Muscle tissues.", "Dissection: Nerves of the upper limb. Cross-sectional anatomy of upper limb. Histology: Supporting tissues: Hyaline cartilage, Elastic cartilage, Fibrocartilage, Bone, Endochondral ossification."],
    ["6", "Nerve tissue, part 1.", "Dissection: 1st practical assessment — Anatomy of the upper limb. Histology: Muscle tissue: Smooth muscle, Skeletal muscle cross section, Skeletal muscle longitudinal section, Cardiac muscle, Cardiac muscle iron hematoxylin."],
    ["7", "Nerve tissue, part 2. Formed elements of blood. Haematopoiesis.", "Dissection: Bones of the pelvis and free lower limb. Joints of the pelvis and free lower limb. Histology: Nerve tissue, part 1: Sensory ganglion, Spinal cord, Cerebral cortex, Cerebellum, Vegetative ganglion."],
    ["8", "Structure of trunk: bones, joints, muscles. Layers of thoracic wall. Surface projections of thoracic organs.", "Dissection: Muscles of the pelvis and free lower limb. Cross-sectional anatomy of lower limb. Histology: Nerve tissue, part 2: Peripheral nerve longitudinal and cross sections, Os-stained sections, Astrocyte."],
    ["9", "Biomechanical features of trunk. Functional and sectional anatomy of thorax. Immune and lymphatic systems. Thymus: anatomy and histology.", "Dissection: Blood vessels and nerves of lower limb. Cross-sectional anatomy of lower limb. Histology: 1st practical assessment — Basic tissues."],
    ["10", "Mediastinum: divisions, layers, contents. Heart: chambers and valves.", "Dissection: 2nd practical assessment — Anatomy of lower limb. Histology: Blood vessels: Aorta, artery, artery and vein, spermatic cord."],
    ["11", "Intrinsic vessels of the heart. Impulse generating and conducting system of the heart. Innervation of heart. Anatomy of pericardium. Vegetative nervous system.", "Dissection: Bones, joints of trunk. Anatomy of thoracic cage. Superficial and deep back muscles. Diaphragm. Related cross-sectional anatomy. Histology: Blood smear, haematopoiesis, red bone marrow, lymphoid organs part 1: thymus."],
    ["12", "General embryology. Development of embryo: gastrulation and neurulation.", "Dissection: Superior mediastinum. Surface projections of heart and thoracic organs. External features of heart. Absolute and relative cardiac dullness. Histology: Lymphoid organs part 2: Spleen, lymph node, palatine tonsil, root of tongue."],
    ["13", "Development of amnion and yolk sacs. Fetal blood circulation. Radiology of limbs and chest.", "Dissection: Middle mediastinum. Dissection of heart, cardiac vessels and pericardium. Interior of opened heart. Posterior mediastinum. Related cross-sectional anatomy. Histology: Embryology: Spermatic cord, placenta, chicken embryo."],
    ["14", "Embryology of heart and great vessels.", "Dissection: 3rd practical assessment — Anatomy of trunk, thorax, mediastinum and heart. Histology: 1st practical assessment — Histology of circulation, blood smear, haematopoiesis, lymphoid organs and embryology."],
]
DISP1 = [
    ["1", "General information on the classes and exams. Injury preventive rules and dissecting room regulations. Bones of the upper limb."],
    ["2", "Joints of the upper limb. Cross-sectional anatomy of upper limb."],
    ["3", "Muscles of the upper limb. Cross-sectional anatomy of upper limb."],
    ["4", "Blood vessels of the upper limb. Cross-sectional anatomy of upper limb."],
    ["5", "Nerves of the upper limb. Cross-sectional anatomy of upper limb."],
    ["6", "1st practical assessment — Anatomy of the upper limb."],
    ["7", "Bones of the pelvis and free lower limb. Joints of the pelvis and free lower limb."],
    ["8", "Muscles of the pelvis and free lower limb. Cross-sectional anatomy of lower limb."],
    ["9", "Blood vessels and nerves of lower limb. Cross-sectional anatomy of lower limb."],
    ["10", "2nd practical assessment — Anatomy of lower limb."],
    ["11", "Bones, joints of trunk. Anatomy of thoracic cage. Superficial and deep back muscles. Diaphragm. Related cross-sectional anatomy."],
    ["12", "Superior mediastinum. Surface projections of heart and thoracic organs. External features of heart. Absolute and relative cardiac dullness."],
    ["13", "Middle mediastinum. Dissection of heart, cardiac vessels and pericardium. Interior of opened heart. Posterior mediastinum. Related cross-sectional anatomy."],
    ["14", "3rd practical assessment — Anatomy of trunk, thorax, mediastinum and heart."],
]
HIST1 = [
    ["1", "Use of light microscope. Introduction to histological methods. Interpretation of histological preparations."],
    ["2", "Epithelial tissues, part 1: Kidney, Jejunum, Trachea."],
    ["3", "Epithelial tissues, part 2: Oesophagus, Finger pad, Unicellular gland, Submandibular gland."],
    ["4", "Connective tissues: Finger pad, Tendon, Adipose tissue, frozen adipose tissue."],
    ["5", "Supporting tissues: Hyaline cartilage, Elastic cartilage, Fibrocartilage, Bone, Endochondral ossification."],
    ["6", "Muscle tissue: Smooth muscle, Skeletal muscle cross section, Skeletal muscle longitudinal section, Cardiac muscle, Cardiac muscle iron hematoxylin."],
    ["7", "Nerve tissue, part 1: Sensory ganglion, Spinal cord, Cerebral cortex, Cerebellum, Vegetative ganglion."],
    ["8", "Nerve tissue, part 2: Peripheral nerve longitudinal and cross sections, Os-stained sections, Astrocyte."],
    ["9", "1st practical assessment — Basic tissues."],
    ["10", "Blood vessels: Aorta, artery, artery and vein, spermatic cord."],
    ["11", "Blood smear, haematopoiesis, red bone marrow, lymphoid organs part 1: thymus."],
    ["12", "Lymphoid organs part 2: Spleen, lymph node, palatine tonsil, root of tongue."],
    ["13", "Embryology: Spermatic cord, placenta, chicken embryo."],
    ["14", "1st practical assessment — Histology of circulation, blood smear, haematopoiesis, lymphoid organs and embryology."],
]
ANAT2_ROWS = [
    ["1", "Anatomy of the upper airways. Anatomy of lower airways. Development of respiratory system.", "Dissection: Summary of mediastinum: divisions and contents. Related cross-sectional anatomy. Histology: Recapitulation."],
    ["2", "Anatomy, histology and development of oral cavity, teeth and tongue.", "Dissection: Nasal cavity, paranasal sinuses, larynx, trachea, lungs and pleura. Histology: Respiration: Trachea, Lung, Lung orcein+H."],
    ["3", "Anatomy, histology and development of oropharyngeal isthmus, pharynx and esophagus. Anatomy, histology and development of large salivary glands.", "Dissection: Cross-sectional anatomy of nasal cavity, paranasal sinuses, larynx, trachea, lungs. Histology: Digestive system: Lip, dorsum of tongue, circumvallate papilla, parotid gland, submandibular gland, sublingual gland."],
    ["4", "Blood supply, lymphatic drainage, innervation and topographical relationships of abdominal organs.", "Dissection: Muscles of abdominal wall, rectus sheath. Surface projections of abdominal organs. Topographic division of abdominal cavity. Peritoneum, omental bursa. Histology: General structure of alimentary tract. Esophagus."],
    ["5", "Anatomy of stomach, small and large intestines. Histology and embryology of stomach, small and large intestines.", "Dissection: Midsagittal plane section of head: oral cavity, pharynx, esophagus. Histology: Cardia, fundus/corpus, pylorus, duodenum, jejunum, ileum."],
    ["6", "Anatomy, histology and development of liver, extrahepatic duct system, gall bladder and pancreas.", "Dissection: Stomach. Blood supply to abdominal organs. Branches of abdominal aorta. Related cross-sectional anatomy. Histology: Large intestine, vermiform appendix, anal canal."],
    ["7", "Anatomy of retro-peritoneum. Anatomy and histology of urinary system. Investigation of alimentary system by imaging techniques.", "Dissection: Topography and anatomy of small and large intestines. Related cross-sectional anatomy. Histology: Liver, liver Ag, liver Kupffer cells, gallbladder, pancreas."],
    ["8", "Anatomy of female genital organs.", "Dissection: Anatomy of liver, extrahepatic ducts, pancreas and spleen. Anatomy of hepatic portal vein and inferior vena cava. Related cross-sectional anatomy. Histology: 1st practical assessment — Respiratory and digestive systems."],
    ["9", "Anatomy of male genital organs. Sacral parasympathetic system. Anatomy of female and male genitalia.", "Dissection: 1st practical assessment — Respiratory and digestive systems, spleen and abdominal wall. Histology: Urogenital systems: Kidney, ureter, urinary bladder, penile urethra."],
    ["10", "Development of urogenital system.", "Dissection: Posterior abdominal wall. Retroperitoneal organs and surface projections. Anatomy and topography of kidneys and ureters. Histology: Ovary, uterine tube, uterus, cervix of uterus."],
    ["11", "Pelvic connective tissue structures. The perineum. Endocrine organs, part 1.", "Dissection: Female genital organs. Study of mid-sagittal plane-cut preparations of female pelvis and perineum. Related cross-sectional anatomy. Histology: Testis-epididymis, spermatic cord, seminal vesicle, prostate, penis."],
    ["12", "Endocrine organs, part 2.", "Dissection: Male genital organs. Inguinal canal. Study of mid-sagittal plane-cut preparations of male pelvis and perineum. Related cross-sectional anatomy. Histology: Endocrine organs: Diencephalon, hypophysis, pineal gland."],
    ["13", "Endocrine organs, part 2. Investigation of uropoietic system by imaging techniques.", "Dissection: Female and male perinea, ischioanal fossa, pudendal canal. Related cross-sectional anatomy. Histology: Thyroid gland, parathyroid gland, suprarenal gland, pancreas, corpus luteum."],
    ["14", "Investigation of female and male genitalia by imaging techniques.", "Dissection: 2nd practical assessment — Urogenital organs, lesser pelvis and perineum. Histology: 2nd practical assessment — Urogenital and endocrine organs."],
]
DISP2 = [
    ["1", "Summary of mediastinum: divisions and contents. Related cross-sectional anatomy."],
    ["2", "Nasal cavity, paranasal sinuses, larynx, trachea, lungs and pleura."],
    ["3", "Cross-sectional anatomy of nasal cavity, paranasal sinuses, larynx, trachea, lungs."],
    ["4", "Muscles of abdominal wall, rectus sheath. Surface projections of abdominal organs. Topographic division of abdominal cavity. Peritoneum, omental bursa."],
    ["5", "Midsagittal plane section of head: oral cavity, pharynx, esophagus."],
    ["6", "Stomach. Blood supply to abdominal organs. Branches of abdominal aorta. Related cross-sectional anatomy."],
    ["7", "Topography and anatomy of small and large intestines. Related cross-sectional anatomy."],
    ["8", "Anatomy of liver, extrahepatic ducts, pancreas and spleen. Anatomy of hepatic portal vein and inferior vena cava. Related cross-sectional anatomy."],
    ["9", "1st practical assessment — Respiratory and digestive systems, spleen and abdominal wall."],
    ["10", "Posterior abdominal wall. Retroperitoneal organs and surface projections. Anatomy and topography of kidneys and ureters."],
    ["11", "Female genital organs. Study of mid-sagittal plane-cut preparations of female pelvis and perineum. Related cross-sectional anatomy."],
    ["12", "Male genital organs. Inguinal canal. Study of mid-sagittal plane-cut preparations of male pelvis and perineum. Related cross-sectional anatomy."],
    ["13", "Female and male perinea, ischioanal fossa, pudendal canal. Related cross-sectional anatomy."],
    ["14", "2nd practical assessment — Urogenital organs, lesser pelvis and perineum."],
]
HIST2 = [
    ["1", "Recapitulation."],
    ["2", "Respiration: Trachea, Lung, Lung orcein+H."],
    ["3", "Digestive system: Lip, dorsum of tongue, circumvallate papilla, parotid gland, submandibular gland, sublingual gland."],
    ["4", "General structure of alimentary tract. Esophagus."],
    ["5", "Cardia, fundus/corpus, pylorus, duodenum, jejunum, ileum."],
    ["6", "Large intestine, vermiform appendix, anal canal."],
    ["7", "Liver, liver Ag, liver Kupffer cells, gallbladder, pancreas."],
    ["8", "1st practical assessment — Respiratory and digestive systems."],
    ["9", "Urogenital systems: Kidney, ureter, urinary bladder, penile urethra."],
    ["10", "Ovary, uterine tube, uterus, cervix of uterus."],
    ["11", "Testis-epididymis, spermatic cord, seminal vesicle, prostate, penis."],
    ["12", "Endocrine organs: Diencephalon, hypophysis, pineal gland."],
    ["13", "Thyroid gland, parathyroid gland, suprarenal gland, pancreas, corpus luteum."],
    ["14", "2nd practical assessment — Urogenital and endocrine organs."],
]

# Head/Neck/Neuro from Curriculum 2025/2026 pp. 62–64
HN_LEC = [
    ["1", "Anatomy and blood supply of the spinal cord. Fine structure of the grey matter and white matter. Rexed's laminae and corresponding nuclei. Arrangement of the spinal cord tracts. Reflex arcs of the spinal cord."],
    ["2", "Neuroanatomy and blood supply of the medulla oblongata, pons and mesencephalon. Cranial nerve nuclei and the reticular formation."],
    ["3", "Diencephalon: organization. Thalamus and hypothalamus. Blood supply to the diencephalon."],
    ["4", "Anatomy, histology and synaptology of the cerebellum. Neuroanatomy of the cerebellar movement regulation. Morphological and functional bases of the regulation of the blood circulation in the brain: the blood-brain barrier and the CSF."],
    ["5", "Neuroanatomy of the cerebral cortex. The ‘module concept’ in the cerebral cortex architecture. The limbic system incl. the hippocampus."],
    ["6", "Basal forebrain: amygdaloid complex. Basal nuclei: anatomy and their functions in the movement regulation."],
    ["7", "Development of the nervous system."],
    ["8", "The cranial nerves V, VII, VIII, IX, X, XI and XII: ganglia and peripheral branches."],
    ["9", "Anatomy and histology of the eye. Parts, layers and blood supply of the retina. Accessory visual structures: eyelids, lacrimal apparatus and extraocular muscles."],
    ["10", "Neuroanatomy of the visual pathway. Light reflex of the pupil. Accommodation reflex. Horizontal and vertical gaze control."],
    ["11", "Anatomy and histology of the external and middle ears. Anatomy of the inner ear: osseous and membranous labyrinths."],
    ["12", "Organ of Corti. Fine structures of the cristae and maculae. Auditory and vestibular pathways."],
    ["13", "Development of the eye and ear."],
    ["14", "The branchial apparatus: formation, development and derivatives of the pharyngeal arches, pouches and grooves."],
]
HN_DIS = [
    ["1", "Injury preventive rules and dissecting room regulations. Cerebral hemispheres: gyri and sulci. Blood supply to the brain, the cerebral arterial circle."],
    ["2", "Vertebral canal, meninges of the spinal cord and spinal cord preparation. Duplications of the dura mater, meningeal spaces. Cross-sectional anatomy of CNS."],
    ["3", "Structure of the brainstem, the fourth ventricle, rhomboid fossa. Exits of the cranial nerves (from the brainstem and the skull). Cross-sectional anatomy of CNS."],
    ["4", "Diencephalon. Lateral and third ventricles. Flechsig's cut. The extreme, external and internal capsules. Basal nuclei (ganglia). Cross-sectional anatomy of CNS."],
    ["5", "Cerebellum: topography, parts and blood supply. Cerebellar nuclei. Cerebellar peduncles. Hippocampal formation. Cross-sectional anatomy of CNS."],
    ["6", "1st practical assessment — Macroscopic anatomy of the CNS."],
    ["7", "Skull, part 1: Temporal and sphenoid bones. Maxilla and mandible. The cranial base: external and internal surfaces. The facial (frontal) and lateral aspects of the skull."],
    ["8", "Skull, part 2: Calvaria. Bony nasal and oral cavities. Infratemporal and pterygopalatine fossae. Meninges."],
    ["9", "Muscles of the neck. Cervical triangles. Fascial system of the neck. Masticatory and facial muscles. Related cross-sectional anatomy."],
    ["10", "Regions of the head and neck; their arterial supply, venous, lymphatic drainage and lymph nodes."],
    ["11", "Topography of the orbit. Anatomy of the eye."],
    ["12", "Anatomy of the middle and inner ears. Cross-sectional anatomy of the orbit and ears."],
    ["13", "Cervical plexus. Cervical part of the sympathetic trunk. Organization of the peripheral parasympathetic system in the head. Pterygopalatine fossa. Thyroid gland. Cross-sectional anatomy of neck."],
    ["14", "2nd practical assessment — Skull. Regions of the head and neck."],
]
HN_HIS = [
    ["1", "General information, rules and regulations. Peripheral nerve (longit. & cross sections, HE). Peripheral nerve (longit. & cross sections, Os)."],
    ["2", "Sensory nerve ending (HE). Sensory nerve ending (Ag). Motor end-plate (AChE). Sensory ganglion (HE). Vegetative ganglion (Ag)."],
    ["3", "Spinal cord (HE). Spinal cord (myelin staining). Medulla oblongata (Loyez)."],
    ["4", "Diencephalon (oxytocin IHC). Astrocytes (GFAP IHC). Microglia (CD11b IHC)."],
    ["5", "Cerebellum (HE). Cerebellum (Ag). Hippocampus."],
    ["6", "Neocortex (HE). Neocortex (parvalbumin IHC)."],
    ["7", "1st practical assessment — The nervous systems."],
    ["8", "Cranial nerves: ganglia and peripheral branches."],
    ["9", "Finger pad (HE). Hairy skin (HE). Lacrimal gland (HE)."],
    ["10", "Eye (HE). Eyelid (HE)."],
    ["11", "Resting mammary gland (HE). Lactating mammary gland (HE)."],
    ["12", "Cochlea (HE). Tympanic cavity."],
    ["13", "2nd practical assessment."],
    ["14", "Recapitulation."],
]

BIOC1 = [
    ["1", "Biochemistry of the blood. RBC. Biochemistry of the blood. White blood cells.", "General information, refreshment."],
    ["2", "Biochemistry of the blood. Blood plasma.", "Determination of bilirubin."],
    ["3", "Biomembranes.", "Seminar: Blood, membranes."],
    ["4", "Biochemistry of the muscle.", "Electrophoresis of serum proteins."],
    ["5", "Biochemistry of the connective tissue. Adhesive glycoproteins.", "Ion determination by colorimetry, blood gas analysis."],
    ["6", "Biochemistry of cell adhesion, cytoskeleton. Biochemistry of liver. First pass metabolism, LFT.", "Diagnosis of heart attack and determination of cardiovascular risk factors: cholesterol, triglycerides, lipoproteins."],
    ["7", "Biochemistry of liver. Biotransformation. Biochemistry of the nervous tissue. Neurotransmitters.", "Seminar: Connective tissue, cell adhesion and cytoskeleton, nutrition."],
    ["8", "Biochemistry of the nervous tissue. Neurotransmitters.", "Biochemistry of liver. Determination of ALAT and ASAT."],
    ["9", "Biochemistry of the endocrine system.", "Seminar: Liver, muscle, nervous tissue."],
    ["10", "Holiday.", "Cholinergic neurotransmission. Determination of cholinesterase enzyme activity."],
    ["11", "Biochemistry of the endocrine system. Regulation of gene expression.", "Cholinergic neurotransmission. Determination of cholinesterase enzyme activity."],
    ["12", "Regulation of gene expression.", "Determination of blood glucose and HbA1c."],
    ["13", "Biological signalization, second messenger systems.", "Determination of mRNA isoform levels by RT-PCR."],
    ["14", "Biological signalization, second messenger systems. General principles of biochemical adaptation, limits of adaptation.", "Seminar: Endocrine system, cell signalling."],
]
BIOC2 = [
    ["1", "Proteins and bioenergetics: structure and function of proteins, thermodynamics of living systems.", "General information, work safety, principles of lab work."],
    ["2", "Enzymology: enzyme classes, coenzymes, characterisation of enzymes, isoenzymes, multienzyme systems.", "Determination of protein concentration."],
    ["3", "Enzymology: molecular mechanism of catalysis, enzyme kinetics, modulation and regulation of enzyme activity.", "Substrate specificity and temperature optimum of amylase enzyme activity."],
    ["4", "Carbohydrate metabolism: digestion and absorption of carbohydrates, glycolysis, pyruvate dehydrogenase enzyme complex, gluconeogenesis.", "Seminar: proteins, enzymes."],
    ["5", "Carbohydrate metabolism: fructose and galactose metabolism, glycogen metabolism, pentose phosphate cycle and glucuronide shunt.", "Assay of activity of alkaline phosphatase."],
    ["6", "Carbohydrate metabolism: regulation of blood glucose level, glycoproteins. Lipid metabolism: eicosanoids, digestion and absorption of lipids, lipoprotein metabolism.", "Seminar: carbohydrate metabolism."],
    ["7", "Lipid metabolism: lipid mobilisation, oxidation of fatty acids, ketone bodies, diabetes mellitus.", "Determination of glucose-6-phosphatase activity."],
    ["8", "Lipid metabolism: synthesis of fatty acids, synthesis of triacyl glycerols and phospholipids, sphingolipids, cholesterol and steroid metabolism.", "1st MTO."],
    ["9", "Amino acid metabolism: digestion and absorption of proteins, catabolism of essential amino acids, fate of amino group, urea cycle.", "Seminar: lipid metabolism."],
    ["10", "Amino acid metabolism: metabolism of non-essential amino acids, fate of carbon skeleton of amino acids, one-carbon units, glutathione.", "Determination of triacyl glycerol and cholesterol."],
    ["11", "Amino acid metabolism: Synthesis of hem and porphyrine, enterohepatic circulation of hem degradation products.", "Seminar: amino acid metabolism."],
    ["12", "Citric acid cycle: steps and regulation of the cycle, relationship between the cycle and other metabolic pathways.", "Seminar: citric acid cycle, respiratory chain, oxidative phosphorylation. 2nd MTO."],
    ["13", "Mitochondrial transport systems, mechanism of respiratory chain and oxidative phosphorylation.", "Investigation of oxygen consumption of isolated mitochondria."],
    ["14", "Nucleotide metabolism: synthesis and degradation of purine and pyrimidine nucleotides, salvage pathways, synthesis of deoxyribonucleotides.", "Nucleotide metabolism. Determination of uric acid concentration."],
]
STATS = [
    ["1", "Types of data, their characterization, and visualization. Definitions of continuous and discrete variables and characterization of their distributions."],
    ["2", "Basics of probability: Probability; discrete probability variables and their distribution, expected value, and variance; discrete distributions, binomial distribution."],
    ["3", "Odds and odds ratios. 95% confidence interval for the odds ratio, practical examples."],
    ["4", "Measurements of diagnostic tests. Diagnostic tests and their measurements: sensitivity, specificity, PPV, NPV and diagnostic accuracy."],
    ["5", "The normal distribution. Standardization. The binomial test. Confidence intervals for the population mean."],
    ["6", "1st MTO."],
    ["7", "T-tests: one-sample, paired, Student and Welch two-sample t-test."],
    ["8", "Analysis of variance: principle of one-way ANOVA, F-test, pairwise comparisons."],
    ["9", "Correlation and linear regression analysis."],
    ["10", "The chi-squared test for independence: assumptions, Fisher exact test."],
    ["11", "Measure of agreement; 2x2 tables in epidemiology: Cohen-Kappa, relative risk."],
    ["12", "Survival analysis: life tables, Kaplan-Meier product limit, log-rank test."],
    ["13", "2nd MTO."],
    ["14", "Nonparametric methods: Wilcoxon rank test; Mann-Whitney test; Kruskal-Wallis test; rank correlation; summary."],
]

# Newly filled from curriculum
BASICS_CHEM = [
    ["1", "Basic terms. Structure of atoms. The periodic table and periodic properties.", "Important terms: atomic mass, molar mass, moles, chemical formulas, chemical reactions, stoichiometry."],
    ["2", "Strong chemical bonds: covalent and ionic bonds.", "Atomic models, electronic configuration of atoms. The periodic table."],
    ["3", "Intermolecular forces: hydrogen bonding and van der Waals forces (dipole-dipole and London forces).", "Strong chemical bonds. Lewis structures."],
    ["4", "Bioinorganic chemistry.", "Intermolecular forces."],
    ["5", "States of matter. Homogenous and heterogeneous systems. Colloids.", "The most important elements and compounds. Nomenclature of inorganic compounds."],
    ["6", "Solutions. Metathesis reactions.", "Colloids."],
    ["7", "Chemical equilibrium. Electrolytes. Acid-base concepts.", "Calculations involving the composition of solutions."],
    ["8", "Equilibrium in electrolytes, pH, and pOH. Acid-base ionization equilibrium.", "Chemical equilibrium. Acid-base concepts."],
    ["9", "Acid-base titration. Buffers.", "The pH concept, pH calculations."],
    ["10", "Electrochemistry. Oxidation-reduction reactions. Voltaic cells.", "Acid-base titration problems. Buffers. Calculations involving buffers."],
    ["11", "Reaction kinetics.", "Redox reactions and voltaic cells."],
    ["12", "Thermodynamics.", "Basic terms of thermodynamics and reaction kinetics."],
    ["13", "General principles of organic chemistry: basic terms, classification, and functional groups.", "Organic compounds: formulas, functional groups."],
    ["14", "General principles of organic chemistry: nomenclature, types, and mechanism of reactions.", "Naming and reactions of organic compounds."],
]
MED_CHEM = [
    ["1", "Hydrocarbons: alkanes, alkenes, alkynes, and aromatic hydrocarbons. Alkyl halides.", "Seminar: Formula drawing and nomenclature of hydrocarbons and alkyl halides. Practice: Review of requirements. Fire and safety precautions. The principle of photometry."],
    ["2", "Hydroxyl group-containing organic compounds. Thiols and thioethers.", "Seminar: Isomerism and chemical reactions of hydrocarbons and alkyl halides. Practice: Volumetric analysis. Using a pipette and a burette and pH measurement. Acid-base titration."],
    ["3", "Amines.", "Seminar: Hydroxyl group-containing organic compounds, thiols, and thioethers. Practice: Graded practice."],
    ["4", "Oxo compounds.", "Seminar: Amines. Practice: Graded practice."],
    ["5", "Chirality, optical isomerism.", "Seminar: Oxo compounds. Practice: Graded practice."],
    ["6", "Carboxylic acids and substituted carboxylic acids.", "Seminar: Chirality, optical isomerism. Practice: Modeling of chirality."],
    ["7", "Carboxylic acid derivatives.", "Seminar: Carboxylic acids and substituted carboxylic acid. Practice: Graded practice."],
    ["8", "Heterocyclic compounds.", "Seminar: Carboxylic acid derivatives. Lipids. Practice: Graded practice."],
    ["9", "Amino acids.", "Seminar: Heterocyclic compounds. Practice: Graded practice."],
    ["10", "Peptides and proteins.", "Seminar: Amino acids. Practice: Graded practice."],
    ["11", "Monosaccharides.", "Seminar: Peptides and proteins. Practice: Graded practice."],
    ["12", "Di-, oligo-, and polysaccharides.", "Seminar: Monosaccharides. Practice: Examination of some important functional groups."],
    ["13", "Steroids. Nucleic acids.", "Seminar: Di-, oligo-, and polysaccharides. Practice: Make-up laboratory practice."],
]
CHEM_MISC = [
    ["1", "Fear of the Unknown: Chemicals. Life as a Risky Business. Natural Products: a Delusion of Safety."],
    ["2", "Man-Made Commodities and Safety Issues. The Cholera Pandemonium: the Blind Leading the Blind. Regulating Chemicals: Maybe or Maybe Not."],
    ["3", "Biowaste: Biotechnology in Perspective. Vedic Wisdom: Lead and Ayurveda. Manipulating Weather: Ocean Fertilization."],
    ["4", "Test Your Cranberry Pie: Vitamin C and Benzoates. Food Dyes: the Good, the Bad, and the Ugly. To Add or Not to Add? Food Additives."],
    ["5", "The Organic Vegetable Hype. Fat Matters: Margarine vs. Butter. Fake Food and Kidney Stones."],
    ["6", "The Coming Shortage: Vanilla and Menthol. Red Alert: Meat Colors. Moldy Business: Whole-Grain Cereals."],
    ["7", "Sweet Dreams without Sugar: Artificial Sweeteners. Sweet as Birch: Xylitol. The Thickening Stuff: Guar Gum Gumbo."],
    ["8", "Is Caffeine Free of Risk? Perfect Timing: Egg Cooking. The Biofuel Dilemma."],
    ["9", "Food Fraud: Then and Now. The Vitamin that Never was: B17. Joint Efforts: Glucosamine and Chondroitin."],
    ["10", "Is the Use of Cyanogen Bromide Forbidden in Hospitals? Poison in Groundwater: Arsenic. Was Napoleon Murdered with Arsenic?"],
    ["11", "Don't Touch the Spilled Mercury! Was DDT of More Harm Than Use? Could Dioxin be the Most Toxic Substance?"],
    ["12", "The Great Hungarian Red Mud Deluge. The Erin Brockovich Mystery: Chromium Salts. The Fluoride War. Nonsense du jour: Food Babe."],
    ["13", "What Was the Gulf War Syndrome? The Strange Case of Bisphenol A. Is grapefruit a medicinal plant?"],
]
CYTO = [
    ["1", "Introduction"],
    ["2", "The cell membrane and primary active transport"],
    ["3", "Secondary active transport and ion channels"],
    ["4", "Receptors and signaling"],
    ["5", "Cell junctions"],
    ["6", "Extracellular matrix"],
    ["7", "The cytoskeleton"],
    ["8", "The endoplasmic reticulum and the Golgi apparatus"],
    ["9", "Vesicular transport"],
    ["10", "Lysosomes and their classes. Peroxisomes"],
    ["11", "The mitochondrion"],
    ["12", "The nucleus and the nucleolus"],
    ["13", "The cell cycle, mitosis, and meiosis"],
]
CB1 = [
    ["1", "Structure and operation of the cell", "Handling of technical devices"],
    ["2", "The DNA", "Microscopy-1"],
    ["3", "Transcription, translation & proteins", "Microscopy-2"],
    ["4", "Mutation & jumping genes", "DNA and RNA purification"],
    ["5", "Bacterial genetics", "Genetic exercises"],
    ["6", "Genetic regulation in eukaryotes", "Separation techniques"],
    ["7", "Mendelian and non-Mendelian genetics", "Lac operon & consultation"],
    ["8", "Epigenetics", ""],
    ["9", "Genes and traits", ""],
    ["10", "Genetic diseases", ""],
    ["11", "Evolution", ""],
    ["12", "Cytoskeleton & membrane processes", ""],
    ["13", "Molecular biology of viruses", ""],
    ["14", "Frontiers of molecular and cell biology", ""],
]
CB2 = [
    ["1", "Human genome", "Molecular cloning"],
    ["2", "Genetically modified organisms & cloning", "PCR & DNA sequencing"],
    ["3", "Cell cycle & tumor formation", "Detection of DNA and RNA"],
    ["4", "Molecular medicine", "Detection of proteins"],
    ["5", "Cell signalling-1", "DNA and protein chips, DNA finger printing"],
    ["6", "Cell-signalling-2", "Genetic exercises"],
    ["7", "Cell communication & tissue differentiation", "Reporter genes & consultation"],
    ["8", "Genetic regulation of ontogenesis", ""],
    ["9", "Neural communication & consciousness", ""],
    ["10", "Molecular biology of sensation", ""],
    ["11", "Immunogenetics", ""],
    ["12", "Molecular evolution", ""],
    ["13", "Genetics of behaviour", ""],
    ["14", "Genetic disease of brain and psyche", ""],
]
PHYS1 = [
    ["1", "Membrane physiology: membrane transport, signalling systems, cellular electrophysiology", "Introduction to Physiology labs. Membrane electrophysiology"],
    ["2", "Nerve and muscle physiology: primary sensory neurons, autonomic nervous system, motor neurons, striated muscle and smooth muscle.", "Electromyography (EMG)"],
    ["3", "Blood physiology: fluid compartments, blood plasma, erythropoesis and degradation of red blood cells, ABO and Rh blood groups", "Blood tests: haematocrit, haemoglobin concentration, cell counts, ABO/Rh blood groups. Blood tests: hemostasis"],
    ["4", "Respiratory physiology: ventilation, gas exchange, regulation", "Human spirometry"],
    ["5", "Cardiovascular physiology: the cardiac cycle, cellular electrophysiology and ECG, hemodynamics, the microcirculation, autonomic and hormonal regulation of the systemic and local circulation.", "Circulation: Cardiac cycle. Circulation: ECG. Circulation: Hemodynamics"],
    ["6", "Renal physiology", "Renal clearance of test substances"],
]
PHYS2 = [
    ["1", "Physiology of the gastrointestinal tract", "Urine tests."],
    ["2", "Metabolism and nutrition.", "Gastrointestinal tract: study of digestion and nutrition."],
    ["3", "Endocrine systems: hypophysis, thyroid gland, adrenal gland, endocrine pancreas", "Endocrinology: Oral glucose tolerance test, pregnancy test"],
    ["4", "Integrative physiology: regulation of energy metabolism, osmoregulation, volume regulation, potassium, calcium, pH homeostasis, Thermoregulation.", "pH regulation, evaluation of arterial blood gas"],
    ["5", "Sports physiology", "Study of cardiovascular adaptation to physical exercise."],
    ["6", "Reproductive physiology: sexual function, physiology of pregnancy, parturition, growth and development.", "Study of human EEG, mini mental test"],
    ["7", "CNS physiology: introduction, the cerebral circulation", "Study of the cerebral circulation"],
    ["8", "Sensory systems: somatosensory system, pain, vision, hearing, olfaction and taste", "Tests of somatosensory systems. Test of hearing. Tests of vision"],
    ["9", "Motor systems: spinal, brainstem, cortical integration of motor functions. The vestibular system. The role of the cerebellum and the basal ganglia in motor functions.", "Study of human motor functions"],
    ["10", "Sleep/wake cycle, the EEG. Circadian rhythms.", "Cognitive tests and study of sleep-wake cycling"],
    ["11", "Physiology of emotions, motivation, reward and punishment. Physiology of learning and memory. Physiology of speech", ""],
]
MP1_LEC = [
    ["Lecture", "Biomechanics. Muscle function. Deformations, elasticity, viscoelasticity. Biomechanics of muscle function: relationships between muscle length and tension; force, velocity and power in skeletal muscles. A mechanical model of skeletal muscles. Surface forces in biomaterials: surface tension, wall tension in hollow bodies."],
    ["Lecture", "Fundamentals of the senses: hearing. Reflexion and refraction of sound at boundaries between media; acoustic resistance; Doppler effect; sound level; subjective loudness. Frequency dependence of human hearing. The role and function of the outer, middle and inner ear."],
    ["Lecture", "Fundamentals of the senses: vision. Reduced eye model, accommodation, adaptation, molecular mechanisms of vision, colour vision. Vision defects; the limits of visual acuity."],
    ["Lecture", "Flow of fluids. Equation of continuity, Bernoulli’s law. Laminar and turbulent flow; Reynolds number. Viscosity of fluids: Newton's law of friction, the viscosity of blood, Hagen–Poiseuille law."],
    ["Lecture", "Diffusion and other transport processes. Fick’s laws. Transport across membranes. Osmosis: Starling equilibrium."],
    ["Lecture", "Thermodynamics. Heat balance of the human body. Basal metabolic rate. Newton's law of cooling."],
    ["Lecture", "Signal analysis. Analogue and digital signals. Digitisation. Shannon's sampling theorem. Aliasing. Spectral analysis: the Fourier transform."],
    ["Seminar", "Biomechanics."],
    ["Seminar", "Oscillations and waves. Hearing."],
    ["Seminar", "Optics. Vision."],
    ["Seminar", "Flow of fluids."],
    ["Seminar", "Thermodynamics."],
    ["Seminar", "Consultation."],
]
MP2_LEC = [
    ["Lecture", "Electricity, magnetism and electromagnetism."],
    ["Lecture", "Bioelectric phenomena."],
    ["Lecture", "Quantum physical phenomena in life sciences."],
    ["Lecture", "Spectroscopy and laboratory medicine."],
    ["Lecture", "Principles of lasers. Medical applications of lasers."],
    ["Lecture", "Microscopy (optical-, scanning-, electron-). Mass spectrometry."],
    ["Lecture", "X-rays: general properties, use in diagnostics. Absorption of X-radiation. Producing X-rays, interaction with living substances."],
    ["Lecture", "Nuclear physics. Radioactivity. Nuclear radiation, dosimetry."],
    ["Lecture", "Practical application of radioactive isotopes. Particle accelerators in medical practice."],
    ["Lecture", "Medical imaging techniques: ultrasound, CT, MRI/NMR, PET, infrared diagnostics."],
    ["Lecture", "Physical basis of therapeutic methods: laser-, light, radio- and heat therapy; therapeutic use of electricity."],
    ["Lecture", "Molecular and cellular diagnostics: sedimentation, electrophoretic methods, flow cytometry."],
    ["Seminar", "Electricity, magnetism."],
    ["Seminar", "Bioelectricity."],
    ["Seminar", "The electromagnetic spectrum. Spectroscopy. Lasers."],
    ["Seminar", "X-rays."],
    ["Seminar", "Nuclear physics; radioactivity."],
    ["Seminar", "Consultation."],
]
MEAS1 = [
    ["1", "Occupational health and fire safety training"],
    ["2", "Anthropometric measurements. Fundamental aspects of measurements: derived quantities, measurement error"],
    ["3", "Sound as a mechanical wave"],
    ["4", "Optics of the eye"],
    ["5", "Blood pressure measurement principles and their application"],
    ["6", "Analysis of blood pressure data"],
    ["7", "Practical skills test"],
]
MEAS2 = [
    ["1", "Occupational health and fire safety training"],
    ["2", "Electrocardiography"],
    ["3", "The physical principles of spectroscopy"],
    ["4", "Introduction to nuclear medicine"],
    ["5", "Measurements with ultrasound"],
    ["6", "Tomographic image reconstruction"],
    ["7", "Practical skills test"],
]
IMM = [
    ["1", "The structure and working principle of the immune system. Central and peripheral lymphoid organs. (Definition of antigen, epitope, hapten, pathogen)"],
    ["2", "Characteristics of innate immunity. The relationship between innate and adaptive immunity."],
    ["3", "Complement system. Cell types and mediators involved in inflammation and acute phase response."],
    ["4", "The structure of MHC molecules, polymorphism. Antigen presentation. Development of T and B cells."],
    ["5", "Antigen recognition function of T lymphocytes. The T cell mediated immune response. T cell types, their effector functions."],
    ["6", "B lymphocytes. B cell activation, antigen-dependent differentiation of B cells. The structure of antibodies, antibody-mediated effector functions."],
    ["7", "TEST FOR RECOMMENDED GRADE (1. MTO)"],
    ["8", "Immune responses against extracellular pathogens. Immune responses against intracellular pathogens. Immunescape. Immunological memory. Vaccination."],
    ["9", "Autoimmunity. Peripheral and central immune tolerance."],
    ["10", "Types and characteristics of hypersensitivity reactions. Allergic reactions."],
    ["11", "Transplantation, pregnancy immunology, immunodeficiency pathology."],
    ["12", "2. TEST FOR RECOMMENDED GRADE (2. MTO)"],
    ["13", "Tumor immunology. Immunotherapies and their role in tumor therapy."],
    ["14", "Basic immunology methods. Monoclonal antibodies, Immunodiagnostics."],
]
SURG = [
    ["1", "Asepsis and antisepsis. Historical background. Surgical infections, sources of infections. Types, classification, risks and prevention of wound contaminations. Sterilization, disinfection. Preparation of the patient before operation: scrub preparation and isolation of the surgical site. Scrubbing, disinfection, gowning and gloving of the operating team. Personnel attire and movement. Basic rules of asepsis in the operating room. Postoperative wound management. Surgical antisepsis. Design and equipments of the operating room, basic technical background. Operating room personnel and their duties. Positioning of the patient on the operating table. Positioning.", "General information. Scrubbing, gowning and gloving. Practical rules of asepsis in the operating room. Behavior and movement in the operating room."],
    ["2", "Surgical instruments. Basic surgical instruments, special surgical tools and technologies, suture materials. Wound closure (sutures, clips, adhesive strips). Imperfections of suturing techniques. Removal of sutures. Drainage.", "Basic surgical instruments, suture materials, textiles. Scrubbing, gowning and gloving. Scrub preparation and draping of the surgical site. Making incisions (on skin pad), wound closure with sutures or clips. Practicing instrument knots by means of the Suture Tutor program."],
    ["3", "The operation. Basic surgical interventions. Indications for an operation, informed consent, operative risk, the surgeon’s responsibility. Preoperative investigations. Preoperative preparation of the patient. Basics of minimally invasive surgical interventions. Historical background. Components of the laparoscopic tower, laparoscopic instruments. Local anesthesia (drugs, types of local anesthesia, complications). Perioperative fluid balance, fluid requirements and fluid therapy.", "Tying surgical knots. Tying surgical knots (hand and instrument knots). Knotting under tension and in cavities."],
    ["4", "Wounds. Types and classification of accidental wounds. Wound healing, scar formation. Surgical wounds. Wound closure and its complications. Management of accidental wounds. Dressings, types of bandages. Innovations in wound treatment.", "Cleansing and isolation of the operative field."],
    ["5", "Bleeding. Types and classification of hemorrhage. Signs and consequences of blood loss. Bleeding in surgery (pre-, intra- and postoperative bleeding). Factors influencing operative blood loss. Surgical hemostasis (mechanical, thermal, chemical-biological methods). Blood replacement in surgery, autotransfusion.", "Management of accidental wounds. Dressing, types of dressing. Changing dressing under aseptic conditions. Removal of sutures. Handling surgical bleeding."],
    ["6", "Complications. Definition and classification of complications. Complications of anaesthesia. Complications of wound healing. Complications related to surgery. Haemorrhagic complications. Pathophysiology, signs and treatment of hemorrhagic shock.", "Basics of minimally invasive surgery. Components of the laparoscopic tower, laparoscopic instruments. Eupractic movements, handling of laparoscopic instruments, knotting."],
    ["7", "Basics of minimally invasive surgical interventions. Historical background. Components of the laparoscopic tower, laparoscopic instruments. Basic procedures, pathophysiological background. Complications.", "Suturing of tissue under sterile circumstances."],
    ["8–9", "", "Practical exam. (1) Surgical scrubbing and gowning (2) Knotting under tension and in a deep cavity (3) Surgical suture (mounting of a needle holder, closure of a 5 cm-long incision with Donati-stitches, instrumental knotting)."],
]
INTRO_MED_L = [
    ["1", "Introduction"],
    ["2", "Modern concept of health and illness"],
    ["3", "What influences health?"],
    ["4", "Community diagnosis and descriptive epidemiology"],
    ["5", "Analytic epidemiology, concept of risk"],
    ["6", "Prevention, screening"],
    ["7", "Health promotion, behavioral medicine, stress management"],
    ["8", "History of Medicine I. Earliest medicine, antique times"],
    ["9", "History of Medicine II. Medicine in middle ages, Renaissance, Enlightenment"],
    ["10", "History of Medicine III. Science and technology in the 19th-20th centuries"],
    ["11", "Medical Ethics I. Basic principles of bioethics"],
    ["12", "Medical Ethics II. Medical profession and the Hippocratic oath"],
    ["13", "Medical Ethics III. Ethics, morality and ethical theories"],
]
INTRO_MED_P = [
    ["Practices", "Introduction I–II. Health and illness I–II. What influences health? Stress and lifestyle I–II. Epidemiology I–II. Prevention and health promotion I–II. Basic principles and practice of medical ethics I–II. Consultation."],
]
PSY = [
    ["1", "Scope of psychology. Contemporary themes, perspectives of psychology", "Levels and elements of the communication process"],
    ["2", "Sensation, perception, top-down processes / Attention and memory", "Factors that influence communication"],
    ["3", "Intelligence, Memory", "Verbal and nonverbal communication"],
    ["4", "Personality theories I.", "CLASS-model: setting up the context"],
    ["5", "Personality theories II.", "Situational exercises I."],
    ["6", "The psychology of social interactions", "Situational exercises II."],
    ["7", "Motivation. Emotions / Attitudes and cognitive dissonance", "Consultation"],
]
SOC = [
    ["1", "Description of requirements. Sociology in the medical curriculum."],
    ["2", "How to study the society?"],
    ["3", "Where sociology and medicine meets."],
    ["4", "Doctors as professionals. Becoming a doctor."],
    ["5", "Doctors and patients. Health experience."],
    ["6", "The society we live in."],
    ["7", "How does society affect our health?"],
    ["8", "Sociopoly"],
    ["9", "Poverty around us."],
    ["10", "Who is disabled? The individual or the society?"],
    ["11", "The power of social stigma."],
    ["12", "Rule breakers."],
    ["13", "Our little family."],
    ["14", "Consultation."],
]
ANTH = [
    ["1", "Introduction to cultural and medical anthropology"],
    ["2", "Cultural anthropology of anatomy and physiology (lay beliefs)"],
    ["3", "Medical anthropology of stress and stress-related disease"],
    ["4", "Medical anthropology of pain and nutrition"],
    ["5", "Medical anthropology of sexuality and gynecology"],
    ["6", "Cultural aspects of health care"],
    ["7", "Medical anthropology of death and dying"],
]
HU1 = [
    ["1", "Introduction. Basic expressions. Vowels, consonants, vowel harmony. The Hungarian alphabet."],
    ["2", "Definite and indefinite articles. Numbers. Money and measurements."],
    ["3", "Personal pronouns; to be present tense; the –nak, -nek ending. Nationalities, jobs, adjectives. Greetings, address forms."],
    ["4", "Usage of the verb van; the –ban, -ben ending; the –n, -on, -en, -ön ending; telling the time. Buildings, places and venues; expressions with the verb van."],
    ["5", "Revision 1"],
    ["6", "Indefinite conjugation 1 (present tense)"],
    ["7", "the –t ending; yes-no questions."],
    ["8", "Subjects, food, drinks, vegetables, fruits."],
    ["9", "Indefinite conjugation 2"],
    ["10", "the –val, -vel ending. Cooked food. Some Hungarian dishes."],
    ["11", "Revision 2"],
    ["12", "Verb formation; the infinitive –ni and its usage; the –ul, -ül ending; the –lak, -lek ending."],
    ["13", "Verbs, modal verbs. Festivals, fairs, events."],
    ["14", "Oral tests"],
]
HU2 = [
    ["1", "General revision"],
    ["2", "Conjugation of jönni and menni (present tense); the –ba, -be and –ra, -re endings; the –ból, -ből and –ról, -ről endings."],
    ["3", "Means of transportation, other words in connection with transportation. Public transport in cities, travelling in Hungary."],
    ["4", "Revision 3."],
    ["5", "The possessive endings. Body parts, time expressions (past tense)."],
    ["6", "The verb fáj(t); to be past tense."],
    ["7", "Past tense (first person singular only, indefinite conjugation)"],
    ["8", "the –kor ending; the –tól, -től and the –ig endings."],
    ["9", "The –s, -os, -as, -es, -ös ending"],
    ["10", "linking words. Word formation. Holidays."],
    ["11", "Revision 4"],
    ["12", "Question words; ordinal numbers. The house."],
    ["13", "The –n, -on, -en, -ön ending (meaning on). Rooms and furniture."],
    ["14", "Oral tests"],
]
HU3 = [
    ["1", "General revision"],
    ["2", "Indefinite conjugation (past tense). Postpositions."],
    ["3", "Usage of postpositions of place and time. Geography."],
    ["4", "Revision 5"],
    ["5", "The –nál, nél, -hoz, -hez, -höz, -tól, -től endings."],
    ["6", "Jobs, family."],
    ["7", "Comparative and superlative forms of adjectives. Clothing, colours."],
    ["8", "The possessive structure; the plural –k ending. Describing what somebody looks like."],
    ["9", "Verbs"],
    ["10", "Definite conjugation (present tense)."],
    ["11", "Verbal prefixes."],
    ["12", "Usage of verbal prefixes."],
    ["13", "Revision 7"],
    ["14", "Oral tests"],
]
HU4 = [
    ["1", "General revision"],
    ["2", "Definite conjugation (past tense). Accusative case of personal pronouns."],
    ["3", "Telling the date, the weather, the school year"],
    ["4", "Revision 8"],
    ["5", "Body parts, organs, bones"],
    ["6", "Symptoms"],
    ["7", "Health care workers, buildings and places"],
    ["8", "Medicaments"],
    ["9", "Expressions of time"],
    ["10", "Question words"],
    ["11", "Doctor’s instruction"],
    ["12", "Parts of the medical history"],
    ["13", "Pain, at the doctor’s, at the dentist’s, at the pharmacy"],
    ["14", "Practising role-play"],
    ["15", "Practising role-play"],
]

CSS = """
@page { size: A4; margin: 14mm 12mm 16mm 12mm; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; font-family: Calibri, "Segoe UI", Arial, sans-serif; color: #1a1a1a; font-size: 10.5pt; line-height: 1.35; }
h1 { font-size: 22pt; color: #1e3a5f; margin: 0 0 4px; letter-spacing: .02em; }
h2 { font-size: 14pt; color: #1e3a5f; border-bottom: 2px solid #1e3a5f; padding-bottom: 4px; margin: 22px 0 10px; page-break-after: avoid; }
h3 { font-size: 12.5pt; color: #16324f; margin: 18px 0 8px; page-break-after: avoid; }
h4 { font-size: 11pt; color: #2c5f6e; margin: 12px 0 6px; page-break-after: avoid; }
.banner { background: #1e3a5f; color: #fff; padding: 18px 20px 16px; margin: 0 0 16px; }
.banner h1, .banner p { color: #fff; }
.banner p { margin: 0; opacity: .9; font-size: 11pt; }
.meta { width: 100%; border-collapse: collapse; margin: 8px 0 14px; }
.meta th, .meta td { border: 1px solid #c5d0dc; padding: 6px 8px; text-align: left; vertical-align: top; }
.meta th { background: #1e3a5f; color: #fff; font-weight: 600; }
.legend td { padding: 4px 8px; }
.dot { display: inline-block; width: 11px; height: 11px; border-radius: 50%; margin-right: 6px; vertical-align: middle; }
table.info, table.syl, table.sum { width: 100%; border-collapse: collapse; margin: 0 0 12px; page-break-inside: auto; }
table.info th, table.syl th, table.sum th { background: #1e3a5f; color: #fff; font-weight: 600; text-align: left; padding: 5px 7px; font-size: 9.5pt; }
table.info td, table.syl td, table.sum td { border: 1px solid #cfd8e3; padding: 5px 7px; vertical-align: top; font-size: 9.5pt; }
.course { page-break-inside: avoid; margin-bottom: 8px; }
.src { font-size: 8.5pt; color: #4a5b6b; font-style: italic; margin: 0 0 6px; }
.note { background: #f4f1e8; border-left: 3px solid #b0892e; padding: 8px 10px; font-size: 9.5pt; margin: 8px 0; }
.toc a { color: #1e3a5f; text-decoration: none; }
.sec { padding-left: 8px; border-left: 6px solid #1e3a5f; }
.s-an { border-left-color: #2b6cb0; }
.s-ch { border-left-color: #2f855a; }
.s-cb { border-left-color: #d69e2e; }
.s-ph { border-left-color: #6b46c1; }
.s-mp { border-left-color: #dd6b20; }
.s-im { border-left-color: #c53030; }
.s-su { border-left-color: #9c4221; }
.s-ps { border-left-color: #2d3748; }
.s-ot { border-left-color: #718096; }
footer { display: none; }
"""


def sum_table(rows):
    th = "<tr><th>Course name</th><th>Course code</th><th>Semester/year</th><th>ECTS</th><th>Final successful grade</th><th>Date</th></tr>"
    body = []
    for i, r in enumerate(rows):
        bg = "#f7f9fb" if i % 2 == 0 else "#fff"
        tds = "".join(f'<td style="background:{bg}">{e(c)}</td>' for c in r)
        body.append(f"<tr>{tds}</tr>")
    return f'<table class="sum"><thead>{th}</thead><tbody>{"".join(body)}</tbody></table>'


html_parts = []
html_parts.append(f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Completed Courses &amp; Course Syllabi — Sude Nur Giritli</title>
<style>{CSS}</style>
</head>
<body>
<div class="banner">
  <h1>Completed Courses &amp; Course Syllabi</h1>
  <p>Student Compilation for Admissions and Credit-Recognition Review</p>
</div>
<table class="meta">
<tr><th>Student</th><th>Study Program</th><th>University</th><th>Place of Studies</th></tr>
<tr><td>Sude Nur Giritli OSZKAOR_N_EN_2022</td><td>Medicine</td><td>University of Szeged</td><td>Szeged</td></tr>
<tr><th>Document status</th><th colspan="3">Purpose</th></tr>
<tr><td>Student-created compilation, not an official transcript</td><td colspan="3">Admissions review and credit-recognition evaluation</td></tr>
</table>
<h2>Color-Coded Subject Sections</h2>
<table class="legend sum">
<tr><td><span class="dot" style="background:#2b6cb0"></span> Anatomy, Histology &amp; Embryology</td>
<td><span class="dot" style="background:#2f855a"></span> Chemistry &amp; Biochemistry</td>
<td><span class="dot" style="background:#d69e2e"></span> Cell Biology &amp; Molecular Genetics</td></tr>
<tr><td><span class="dot" style="background:#6b46c1"></span> Physiology</td>
<td><span class="dot" style="background:#dd6b20"></span> Medical Physics</td>
<td><span class="dot" style="background:#c53030"></span> Immunology</td></tr>
<tr><td><span class="dot" style="background:#9c4221"></span> Surgery / Clinical Skills</td>
<td><span class="dot" style="background:#2d3748"></span> Psychology / Social Sciences</td>
<td><span class="dot" style="background:#718096"></span> Other Medical Subjects</td></tr>
</table>
<h2>Table of Contents</h2>
<ol class="toc">
<li>Passed Courses Summary by Subject</li>
<li>Anatomy, Histology &amp; Embryology</li>
<li>Chemistry &amp; Biochemistry</li>
<li>Cell Biology &amp; Molecular Genetics</li>
<li>Physiology</li>
<li>Medical Physics</li>
<li>Immunology</li>
<li>Surgery / Clinical Skills</li>
<li>Psychology / Social Sciences</li>
<li>Other Medical Subjects</li>
</ol>
<p class="src">Missing weekly syllabi were added from the University of Szeged Curriculum 2025/2026 booklet. Previously completed syllabus pages were not rewritten. The curriculum booklet itself was not modified. Student grades, dates, ECTS and course codes are unchanged.</p>
""")

html_parts.append("<h2>1. Passed Courses Summary by Subject</h2>")
html_parts.append('<h3 class="sec s-an">Anatomy, Histology &amp; Embryology</h3>')
html_parts.append(sum_table([
    ["Anatomy, Histology and Embryology I.", "AOK-OAK0211", "2023/2024", "3", "Pass (2)", "08. 02. 2024"],
    ["Dissection Practice I.", "AOK-OAK0221", "2023/2024", "2", "Pass (2)", "15. 12. 2023"],
    ["Histology Practice I.", "AOK-OAK0231", "2023/2024", "2", "Satisfactory (3)", "15. 12. 2023"],
    ["Anatomy, Histology and Embryology II.", "AOK-OAK0241", "2023/2024", "5", "Good (4)", "28. 06. 2024"],
    ["Dissection Practice II.", "AOK-OAK0251", "2023/2024", "2", "Satisfactory (3)", "17. 05. 2024"],
    ["Histology Practice II.", "AOK-OAK0261", "2023/2024", "2", "Satisfactory (3)", "17. 05. 2024"],
    ["Head, Neck and Neuroanatomy Lecture", "AOK-OAK0271", "2024/2025", "4", "Pass (2)", "04. 06. 2025"],
    ["Head, Neck and Neuroanatomy-Dissection Practice", "AOK-OAK0281", "2024/2025", "2", "Pass (2)", "13. 12. 2024"],
    ["Histology of the Nervous System and Sense Organs", "AOK-OAK0291", "2024/2025", "2", "Good (4)", "10. 12. 2024"],
]))
html_parts.append('<h3 class="sec s-ch">Chemistry &amp; Biochemistry</h3>')
html_parts.append(sum_table([
    ["Medical Chemistry I.", "AOK-OAK111", "2023/2024", "6", "Good (4)", "09. 01. 2024"],
    ["Introduction to Medical Chemistry Lecture", "AOK-OAKV141", "2023/2024", "2", "Satisfactory (3)", "19. 12. 2023"],
    ["Medical Chemistry II. lecture", "AOK-OAK113", "2023/2024", "6", "Satisfactory (3)", "26. 06. 2024"],
    ["Chemical Misconceptions", "AOK-OASZV411", "2023/2024", "2", "Good (4)", "21. 05. 2024"],
    ["Biochemistry I.", "AOK-OAK051", "2024/2025", "6", "Pass (2)", "04. 02. 2025"],
    ["Cytomorphology and Microtechnics", "AOK-OAKV211", "2024/2025", "2", "Good (4)", "16. 12. 2024"],
    ["How to learn Biochemistry?", "AOK-OAKV361", "2024/2025", "1", "Pass (2)", "10. 06. 2025"],
]))
html_parts.append('<h3 class="sec s-cb">Cell Biology &amp; Molecular Genetics</h3>')
html_parts.append(sum_table([
    ["Cell Biology and Molecular Genetics I", "AOK-OAK151", "2023/2024", "4", "Pass (2)", "06. 02. 2024"],
    ["Cell Biology and Molecular Genetics II", "AOK-OAK153", "2023/2024", "4", "Pass (2)", "02. 07. 2024"],
]))
html_parts.append('<h3 class="sec s-ph">Physiology</h3>')
html_parts.append(sum_table([
    ["Medical Physiology I.", "AOK-OAK091", "2024/2025", "8", "Pass (2)", "28. 01. 2025"],
    ["Medical Physiology II.", "AOK-OAK093", "2025/2026", "10", "Good (4)", "01. 07. 2026"],
]))
html_parts.append('<h3 class="sec s-mp">Medical Physics</h3>')
html_parts.append(sum_table([
    ["Medical Physics I.", "AOK-OAK101", "2023/2024", "2", "Pass (2)", "21. 12. 2023"],
    ["Measurements in medical physics I.", "AOK-OAK103", "2024/2025", "1", "Good (4)", "06. 01. 2025"],
    ["Medical Physics II. lecture", "AOK-OAK104", "2023/2024", "3", "Pass (2)", "20. 06. 2024"],
    ["Measurements in medical physics II.", "AOK-OAK106", "2023/2024", "1", "Satisfactory (3)", "28. 05. 2024"],
    ["Medical Statistics lecture", "AOK-OAK107", "2023/2024", "1", "Good (4)", "21. 05. 2024"],
    ["Medical Statistics practice", "AOK-OAK108", "2023/2024", "2", "Good (4)", "24. 05. 2024"],
]))
html_parts.append('<h3 class="sec s-im">Immunology</h3>')
html_parts.append(sum_table([
    ["Immunology", "AOK-OAK061", "2024/2025", "2", "Excellent (5)", "27. 06. 2025"],
]))
html_parts.append('<h3 class="sec s-su">Surgery / Clinical Skills</h3>')
html_parts.append(sum_table([
    ["Basic Life Support I.", "AOK-OAK011", "2023/2024", "2", "Excellent (5)", "13. 12. 2023"],
    ["Basic Surgical Skills lecture", "AOK-OAK141", "2024/2025", "3", "Excellent (5)", "27. 05. 2025"],
]))
html_parts.append('<h3 class="sec s-ps">Psychology / Social Sciences</h3>')
html_parts.append(sum_table([
    ["Introduction to Medicine lecture", "AOK-OAK041", "2023/2024", "2", "Satisfactory (3)", "19. 12. 2023"],
    ["Introduction to Psychology, Communication lecture", "AOK-OAK131", "2024/2025", "1", "Pass (2)", "26. 05. 2025"],
    ["Medical Sociology", "AOK-OAK121", "2024/2025", "2", "Excellent (5)", "28. 11. 2024"],
    ["Medical Anthropology Seminar", "AOK-OAK081", "2024/2025", "1", "Excellent (5)", "26. 05. 2025"],
]))
html_parts.append('<h3 class="sec s-ot">Other Medical Subjects</h3>')
html_parts.append(sum_table([
    ["Hungarian Language I.", "AOK-OAK601", "2023/2024", "0", "Satisfactory (3)", "09. 12. 2023"],
    ["Hungarian Language II.", "AOK-OAK602", "2023/2024", "0", "Excellent (5)", "15. 05. 2024"],
    ["Hungarian Language III.", "AOK-OAK603", "2024/2025", "0", "Good (4)", "06. 12. 2024"],
    ["Hungarian Language IV.", "AOK-OAK604", "2024/2025", "0", "Satisfactory (3)", "06. 06. 2025"],
    ["EUGLOH Open University - Science and/or Religion", "XA0021-EUGLOH-OpenU_Scie_Reli", "2023/2024", "3", "Satisfactory", "05. 01. 2024"],
    ["EUGLOH Open University - Making and Breaking: The kaleidoscope of taboo", "XA0021-EUGLOH-OpenU_Taboo", "2023/2024", "3", "Excellent", "07. 06. 2024"],
]))

# Section 2 Anatomy
html_parts.append('<h2 class="sec s-an">2. Anatomy, Histology &amp; Embryology</h2>')
html_parts.append(course("Anatomy, Histology and Embryology I.", [
    ("Course name", "Anatomy, Histology and Embryology I."),
    ("Course code", "AOK-OAK0211"),
    ("Related course codes", "AOK-OAK0211 / AOK-OAK0221 / AOK-OAK0231"),
    ("Semester/year", "2023/2024"),
    ("Semester", "1st"),
    ("Course type", "Lecture / Practice / Practice"),
    ("Category", "Compulsory"),
    ("Department", "Anatomy"),
    ("Hours/week", "2/3/2"),
    ("Credit", "5/3/-"),
    ("ECTS in passed-course record", "3"),
    ("Form of exam", "Exam / Term Mark / Signature"),
    ("Final successful grade", "Pass (2)"),
    ("Date", "08. 02. 2024"),
    ("Related passed courses", "Dissection Practice I.; Histology Practice I."),
], week_table(["Week", "Lecture topics", "Practice / Dissection / Histology topics"], ANAT1_ROWS)))
html_parts.append(course("Dissection Practice I.", [
    ("Course name", "Dissection Practice I."),
    ("Course code", "AOK-OAK0221"),
    ("Semester/year", "2023/2024"),
    ("ECTS", "2"),
    ("Final successful grade", "Pass (2)"),
    ("Date", "15. 12. 2023"),
    ("Corresponding syllabus", "Anatomy, Histology and Embryology I. — Dissection topics"),
], week_table(["Week", "Dissection topics"], DISP1)))
html_parts.append(course("Histology Practice I.", [
    ("Course name", "Histology Practice I."),
    ("Course code", "AOK-OAK0231"),
    ("Semester/year", "2023/2024"),
    ("ECTS", "2"),
    ("Final successful grade", "Satisfactory (3)"),
    ("Date", "15. 12. 2023"),
    ("Corresponding syllabus", "Anatomy, Histology and Embryology I. — Histology topics"),
], week_table(["Week", "Histology topics"], HIST1)))
html_parts.append(course("Anatomy, Histology and Embryology II.", [
    ("Course name", "Anatomy, Histology and Embryology II."),
    ("Course code", "AOK-OAK0241"),
    ("Related course codes", "AOK-OAK0241 / AOK-OAK0251 / AOK-OAK0261"),
    ("Semester/year", "2023/2024"),
    ("Semester", "2nd"),
    ("Course type", "Lecture / Practice / Practice"),
    ("Category", "Compulsory"),
    ("Department", "Anatomy"),
    ("Hours/week", "2/3/2"),
    ("Credit", "3/3/2"),
    ("ECTS in passed-course record", "5"),
    ("Form of exam", "Exam / Term Mark / Term Mark"),
    ("Final successful grade", "Good (4)"),
    ("Date", "28. 06. 2024"),
    ("Related passed courses", "Dissection Practice II.; Histology Practice II."),
], week_table(["Week", "Lecture topics", "Practice / Dissection / Histology topics"], ANAT2_ROWS)))
html_parts.append(course("Dissection Practice II.", [
    ("Course name", "Dissection Practice II."),
    ("Course code", "AOK-OAK0251"),
    ("Semester/year", "2023/2024"),
    ("ECTS", "2"),
    ("Final successful grade", "Satisfactory (3)"),
    ("Date", "17. 05. 2024"),
    ("Corresponding syllabus", "Anatomy, Histology and Embryology II. — Dissection topics"),
], week_table(["Week", "Dissection topics"], DISP2)))
html_parts.append(course("Histology Practice II.", [
    ("Course name", "Histology Practice II."),
    ("Course code", "AOK-OAK0261"),
    ("Semester/year", "2023/2024"),
    ("ECTS", "2"),
    ("Final successful grade", "Satisfactory (3)"),
    ("Date", "17. 05. 2024"),
    ("Corresponding syllabus", "Anatomy, Histology and Embryology II. — Histology topics"),
], week_table(["Week", "Histology topics"], HIST2)))
html_parts.append(course("Head, Neck and Neuroanatomy Lecture", [
    ("Course name", "Head, Neck and Neuroanatomy Lecture"),
    ("Course code", "AOK-OAK0271"),
    ("Semester/year", "2024/2025"),
    ("ECTS", "4"),
    ("Final successful grade", "Pass (2)"),
    ("Date", "04. 06. 2025"),
    ("Corresponding syllabus", "Head, Neck and Neuroanatomy"),
], week_table(["Week", "Lecture topics"], HN_LEC, SRC_SPLIT)))
html_parts.append(course("Head, Neck and Neuroanatomy-Dissection Practice", [
    ("Course name", "Head, Neck and Neuroanatomy-Dissection Practice"),
    ("Course code", "AOK-OAK0281"),
    ("Semester/year", "2024/2025"),
    ("ECTS", "2"),
    ("Final successful grade", "Pass (2)"),
    ("Date", "13. 12. 2024"),
    ("Corresponding syllabus", "Head, Neck and Neuroanatomy"),
], week_table(["Week", "Dissection topics"], HN_DIS, SRC_SPLIT)))
html_parts.append(course("Histology of the Nervous System and Sense Organs", [
    ("Course name", "Histology of the Nervous System and Sense Organs"),
    ("Course code", "AOK-OAK0291"),
    ("Semester/year", "2024/2025"),
    ("ECTS", "2"),
    ("Final successful grade", "Good (4)"),
    ("Date", "10. 12. 2024"),
    ("Corresponding syllabus", "Head, Neck and Neuroanatomy"),
], week_table(["Week", "Histology topics"], HN_HIS, SRC_SPLIT)))

# Chemistry
html_parts.append('<h2 class="sec s-ch">3. Chemistry &amp; Biochemistry</h2>')
html_parts.append(course("Introduction to Medical Chemistry Lecture", [
    ("Course name", "Introduction to Medical Chemistry Lecture"),
    ("Course code", "AOK-OAKV141"),
    ("Semester/year", "2023/2024"),
    ("ECTS", "2"),
    ("Final successful grade", "Satisfactory (3)"),
    ("Date", "19. 12. 2023"),
    ("Corresponding syllabus", "Basics of Medical Chemistry"),
], week_table(["Week", "Lecture topics", "Practice / Seminar topics"], BASICS_CHEM, SRC + " Current curriculum title: Basics of Medical Chemistry (AOK-OAKV143/AOK-OAKV144).")))
html_parts.append(course("Medical Chemistry I.", [
    ("Course name", "Medical Chemistry I."),
    ("Course code", "AOK-OAK111"),
    ("Semester/year", "2023/2024"),
    ("ECTS", "6"),
    ("Final successful grade", "Good (4)"),
    ("Date", "09. 01. 2024"),
    ("Corresponding syllabus", "Medical Chemistry / Basics of Medical Chemistry"),
], week_table(["Week", "Lecture topics", "Practice / Seminar topics"], BASICS_CHEM, SRC + " AOK-OAK111 is not listed separately in the 2025/2026 booklet; first-semester chemistry is published as Basics of Medical Chemistry.")))
html_parts.append(course("Medical Chemistry II. lecture", [
    ("Course name", "Medical Chemistry II. lecture"),
    ("Course code", "AOK-OAK113"),
    ("Semester/year", "2023/2024"),
    ("ECTS", "6"),
    ("Final successful grade", "Satisfactory (3)"),
    ("Date", "26. 06. 2024"),
    ("Corresponding syllabus", "Medical Chemistry"),
], week_table(["Week", "Lecture topics", "Practice / Seminar topics"], MED_CHEM, SRC + " Current curriculum title: Medical Chemistry (AOK-OAK1131/AOK-OAK1141).")))
html_parts.append(course("Chemical Misconceptions", [
    ("Course name", "Chemical Misconceptions"),
    ("Course code", "AOK-OASZV411"),
    ("Semester/year", "2023/2024"),
    ("ECTS", "2"),
    ("Final successful grade", "Good (4)"),
    ("Date", "21. 05. 2024"),
    ("Corresponding syllabus", "Chemical Misconceptions"),
], week_table(["Week", "Topics"], CHEM_MISC, SRC)))
html_parts.append(course("Biochemistry I.", [
    ("Course name", "Biochemistry I."),
    ("Course code", "AOK-OAK051"),
    ("Related course codes", "AOK-OAK051 / AOK-OAK052"),
    ("Semester/year", "2024/2025"),
    ("Semester", "3rd"),
    ("Course type", "Lecture / Practice"),
    ("Category", "Compulsory"),
    ("Department", "Biochemistry"),
    ("Hours/week", "4/2"),
    ("Credit", "6/-"),
    ("ECTS in passed-course record", "6"),
    ("Form of exam", "Exam / Signature"),
    ("Final successful grade", "Pass (2)"),
    ("Date", "04. 02. 2025"),
], week_table(["Week", "Lecture topics", "Practice / Seminar topics"], BIOC1)))
html_parts.append(course("Biochemistry II.", [
    ("Course name", "Biochemistry II."),
    ("Course code", "AOK-OAK053"),
    ("Related course codes", "AOK-OAK053 / AOK-OAK054"),
    ("Semester", "4th"),
    ("Course type", "Lecture / Practice"),
    ("Category", "Compulsory"),
    ("Department", "Biochemistry"),
    ("Hours/week", "4/2"),
    ("Credit", "6/-"),
    ("Form of exam", "Comprehensive Exam / Signature"),
    ("Final successful grade", "Not provided in the supplied materials."),
], week_table(["Week", "Lecture topics", "Practice / Seminar topics"], BIOC2)))
html_parts.append(course("Cytomorphology and Microtechnics", [
    ("Course name", "Cytomorphology and Microtechnics"),
    ("Course code", "AOK-OAKV211"),
    ("Semester/year", "2024/2025"),
    ("ECTS", "2"),
    ("Final successful grade", "Good (4)"),
    ("Date", "16. 12. 2024"),
    ("Corresponding syllabus", "Cytomorphology and Microtechnics"),
], week_table(["Week", "Topics"], CYTO, SRC)))
html_parts.append(course("How to learn Biochemistry?", [
    ("Course name", "How to learn Biochemistry?"),
    ("Course code", "AOK-OAKV361"),
    ("Semester/year", "2024/2025"),
    ("ECTS", "1"),
    ("Final successful grade", "Pass (2)"),
    ("Date", "10. 06. 2025"),
    ("Corresponding syllabus", "Not provided in the supplied materials."),
], '<div class="note">This elective (AOK-OAKV361) is not published as a weekly syllabus in the University of Szeged Curriculum 2025/2026 booklet. No syllabus was added, because it is not in the second document.</div>'))

# Cell bio
html_parts.append('<h2 class="sec s-cb">4. Cell Biology &amp; Molecular Genetics</h2>')
html_parts.append(course("Cell Biology and Molecular Genetics I", [
    ("Course name", "Cell Biology and Molecular Genetics I"),
    ("Course code", "AOK-OAK151"),
    ("Semester/year", "2023/2024"),
    ("ECTS", "4"),
    ("Final successful grade", "Pass (2)"),
    ("Date", "06. 02. 2024"),
    ("Corresponding syllabus", "Cell Biology and Molecular Genetics I."),
], week_table(["Week", "Lecture topics", "Practice / Seminar topics"], CB1, SRC)))
html_parts.append(course("Cell Biology and Molecular Genetics II", [
    ("Course name", "Cell Biology and Molecular Genetics II"),
    ("Course code", "AOK-OAK153"),
    ("Semester/year", "2023/2024"),
    ("ECTS", "4"),
    ("Final successful grade", "Pass (2)"),
    ("Date", "02. 07. 2024"),
    ("Corresponding syllabus", "Cell Biology and Molecular Genetics II."),
], week_table(["Week", "Lecture topics", "Practice / Seminar topics"], CB2, SRC)))

# Physiology
html_parts.append('<h2 class="sec s-ph">5. Physiology</h2>')
html_parts.append(course("Medical Physiology I.", [
    ("Course name", "Medical Physiology I."),
    ("Course code", "AOK-OAK091"),
    ("Semester/year", "2024/2025"),
    ("ECTS", "8"),
    ("Final successful grade", "Pass (2)"),
    ("Date", "28. 01. 2025"),
    ("Corresponding syllabus", "Medical Physiology I."),
], week_table(["Topic block", "Lecture topics", "Practice / Seminar topics"], PHYS1, SRC + " The 2025/2026 booklet lists physiology as topic blocks rather than numbered academic weeks.")))
html_parts.append(course("Medical Physiology II.", [
    ("Course name", "Medical Physiology II."),
    ("Course code", "AOK-OAK093"),
    ("Semester/year", "2025/2026"),
    ("ECTS", "10"),
    ("Final successful grade", "Good (4)"),
    ("Date", "01. 07. 2026"),
    ("Corresponding syllabus", "Medical Physiology II."),
], week_table(["Topic block", "Lecture topics", "Practice / Seminar topics"], PHYS2, SRC + " The 2025/2026 booklet lists physiology as topic blocks rather than numbered academic weeks.")))

# Physics
html_parts.append('<h2 class="sec s-mp">6. Medical Physics</h2>')
html_parts.append(course("Medical Physics I.", [
    ("Course name", "Medical Physics I."),
    ("Course code", "AOK-OAK101"),
    ("Semester/year", "2023/2024"),
    ("ECTS", "2"),
    ("Final successful grade", "Pass (2)"),
    ("Date", "21. 12. 2023"),
    ("Corresponding syllabus", "Medical Physics I."),
], week_table(["Topic type", "Details"], MP1_LEC, SRC)))
html_parts.append(course("Measurements in medical physics I.", [
    ("Course name", "Measurements in medical physics I."),
    ("Course code", "AOK-OAK103"),
    ("Semester/year", "2024/2025"),
    ("ECTS", "1"),
    ("Final successful grade", "Good (4)"),
    ("Date", "06. 01. 2025"),
    ("Corresponding syllabus", "Measurements in medical physics I."),
], week_table(["Item", "Topics"], MEAS1, SRC)))
html_parts.append(course("Medical Physics II. lecture", [
    ("Course name", "Medical Physics II. lecture"),
    ("Course code", "AOK-OAK104"),
    ("Semester/year", "2023/2024"),
    ("ECTS", "3"),
    ("Final successful grade", "Pass (2)"),
    ("Date", "20. 06. 2024"),
    ("Corresponding syllabus", "Medical Physics II."),
], week_table(["Topic type", "Details"], MP2_LEC, SRC)))
html_parts.append(course("Measurements in medical physics II.", [
    ("Course name", "Measurements in medical physics II."),
    ("Course code", "AOK-OAK106"),
    ("Semester/year", "2023/2024"),
    ("ECTS", "1"),
    ("Final successful grade", "Satisfactory (3)"),
    ("Date", "28. 05. 2024"),
    ("Corresponding syllabus", "Measurements in medical physics II."),
], week_table(["Item", "Topics"], MEAS2, SRC)))
html_parts.append(course("Medical Statistics lecture", [
    ("Course name", "Medical Statistics lecture"),
    ("Course code", "AOK-OAK107"),
    ("Semester/year", "2023/2024"),
    ("ECTS", "1"),
    ("Final successful grade", "Good (4)"),
    ("Date", "21. 05. 2024"),
    ("Corresponding syllabus", "Medical Statistics"),
], week_table(["Week", "Practice topics"], STATS)))
html_parts.append(course("Medical Statistics practice", [
    ("Course name", "Medical Statistics practice"),
    ("Course code", "AOK-OAK108"),
    ("Semester/year", "2023/2024"),
    ("ECTS", "2"),
    ("Final successful grade", "Good (4)"),
    ("Date", "24. 05. 2024"),
    ("Corresponding syllabus", "Medical Statistics"),
], week_table(["Week", "Practice topics"], STATS)))

# Immunology
html_parts.append('<h2 class="sec s-im">7. Immunology</h2>')
html_parts.append(course("Immunology", [
    ("Course name", "Immunology"),
    ("Course code", "AOK-OAK061"),
    ("Semester/year", "2024/2025"),
    ("ECTS", "2"),
    ("Final successful grade", "Excellent (5)"),
    ("Date", "27. 06. 2025"),
    ("Corresponding syllabus", "Immunology"),
], week_table(["Week", "Topics"], IMM, SRC)))

# Surgery
html_parts.append('<h2 class="sec s-su">8. Surgery / Clinical Skills</h2>')
html_parts.append(course("Basic Life Support I.", [
    ("Course name", "Basic Life Support I."),
    ("Course code", "AOK-OAK011"),
    ("Semester/year", "2023/2024"),
    ("Course type", "Practice"),
    ("Category", "Compulsory"),
    ("Department", "Emergency Medicine"),
    ("Hours/week", "2"),
    ("Credit / ECTS", "2"),
    ("Form of exam", "Term Mark"),
    ("Final successful grade", "Excellent (5)"),
    ("Date", "13. 12. 2023"),
    ("Corresponding syllabus", "Basic Life Support"),
], week_table(["Section", "Complete topics"], [
    ["Course Format", "The course is taught in block form. Exercises take place on one day in the study period, from 8 am to 5 pm, with an optional practice option in the week before the exam period."],
    ["Lectures", "Guidelines of Basic Life Support. Examinations of patients requiring critical care, recognition of critical needs. Basic Life Support in Covid-19. Advanced Life Support guidelines, basic care for patients in critical state."],
    ["Group Practices", "Location: USz Skills Center. Date according to grouping uploaded to the course’s Coospace page. Period from October, see Coospace for details."],
])))
html_parts.append(course("Basic Surgical Skills lecture", [
    ("Course name", "Basic Surgical Skills lecture"),
    ("Course code", "AOK-OAK141"),
    ("Semester/year", "2024/2025"),
    ("ECTS", "3"),
    ("Final successful grade", "Excellent (5)"),
    ("Date", "27. 05. 2025"),
    ("Corresponding syllabus", "Basic Surgical Skills"),
], week_table(["Week", "Lecture topics", "Practice topics"], SURG, SRC)))

# Psych
html_parts.append('<h2 class="sec s-ps">9. Psychology / Social Sciences</h2>')
html_parts.append(course("Introduction to Medicine lecture", [
    ("Course name", "Introduction to Medicine lecture"),
    ("Course code", "AOK-OAK041"),
    ("Semester/year", "2023/2024"),
    ("ECTS", "2"),
    ("Final successful grade", "Satisfactory (3)"),
    ("Date", "19. 12. 2023"),
    ("Corresponding syllabus", "Introduction to Medicine"),
], week_table(["Week", "Lecture topics"], INTRO_MED_L, SRC) + week_table(["", "Practice / Seminar topics"], INTRO_MED_P)))
html_parts.append(course("Introduction to Psychology, Communication lecture", [
    ("Course name", "Introduction to Psychology, Communication lecture"),
    ("Course code", "AOK-OAK131"),
    ("Semester/year", "2024/2025"),
    ("ECTS", "1"),
    ("Final successful grade", "Pass (2)"),
    ("Date", "26. 05. 2025"),
    ("Corresponding syllabus", "Introduction to Psychology, Communication"),
], week_table(["Week", "Lecture topics", "Practice / Seminar topics"], PSY, SRC)))
html_parts.append(course("Medical Sociology", [
    ("Course name", "Medical Sociology"),
    ("Course code", "AOK-OAK121"),
    ("Semester/year", "2024/2025"),
    ("ECTS", "2"),
    ("Final successful grade", "Excellent (5)"),
    ("Date", "28. 11. 2024"),
    ("Corresponding syllabus", "Medical Sociology"),
], week_table(["Week", "Topics"], SOC, SRC)))
html_parts.append(course("Medical Anthropology Seminar", [
    ("Course name", "Medical Anthropology Seminar"),
    ("Course code", "AOK-OAK081"),
    ("Semester/year", "2024/2025"),
    ("ECTS", "1"),
    ("Final successful grade", "Excellent (5)"),
    ("Date", "26. 05. 2025"),
    ("Corresponding syllabus", "Medical Anthropology"),
], week_table(["Week", "Topics"], ANTH, SRC)))

# Other
html_parts.append('<h2 class="sec s-ot">10. Other Medical Subjects</h2>')
html_parts.append(course("Hungarian Language I.", [
    ("Course name", "Hungarian Language I."),
    ("Course code", "AOK-OAK601"),
    ("Semester/year", "2023/2024"),
    ("ECTS", "0"),
    ("Final successful grade", "Satisfactory (3)"),
    ("Date", "09. 12. 2023"),
    ("Corresponding syllabus", "Hungarian Language I."),
], week_table(["Week", "Topics"], HU1, SRC)))
html_parts.append(course("Hungarian Language II.", [
    ("Course name", "Hungarian Language II."),
    ("Course code", "AOK-OAK602"),
    ("Semester/year", "2023/2024"),
    ("ECTS", "0"),
    ("Final successful grade", "Excellent (5)"),
    ("Date", "15. 05. 2024"),
    ("Corresponding syllabus", "Hungarian Language II."),
], week_table(["Week", "Topics"], HU2, SRC)))
html_parts.append(course("Hungarian Language III.", [
    ("Course name", "Hungarian Language III."),
    ("Course code", "AOK-OAK603"),
    ("Semester/year", "2024/2025"),
    ("ECTS", "0"),
    ("Final successful grade", "Good (4)"),
    ("Date", "06. 12. 2024"),
    ("Corresponding syllabus", "Hungarian Language III."),
], week_table(["Week", "Topics"], HU3, SRC)))
html_parts.append(course("Hungarian Language IV.", [
    ("Course name", "Hungarian Language IV."),
    ("Course code", "AOK-OAK604"),
    ("Semester/year", "2024/2025"),
    ("ECTS", "0"),
    ("Final successful grade", "Satisfactory (3)"),
    ("Date", "06. 06. 2025"),
    ("Corresponding syllabus", "Hungarian Language IV."),
], week_table(["Week", "Topics"], HU4, SRC)))
html_parts.append(course("EUGLOH Open University - Science and/or Religion", [
    ("Course name", "EUGLOH Open University - Science and/or Religion"),
    ("Course code", "XA0021-EUGLOH-OpenU_Scie_Reli"),
    ("Semester/year", "2023/2024"),
    ("ECTS", "3"),
    ("Final successful grade", "Satisfactory"),
    ("Date", "05. 01. 2024"),
    ("Corresponding syllabus", "Not provided in the supplied materials."),
], '<div class="note">This EUGLOH Open University course is not included in the University of Szeged Albert Szent-Györgyi School of Medicine Curriculum 2025/2026 booklet. No syllabus was added, because it is not in the second document.</div>'))
html_parts.append(course("EUGLOH Open University - Making and Breaking: The kaleidoscope of taboo", [
    ("Course name", "EUGLOH Open University - Making and Breaking: The kaleidoscope of taboo"),
    ("Course code", "XA0021-EUGLOH-OpenU_Taboo"),
    ("Semester/year", "2023/2024"),
    ("ECTS", "3"),
    ("Final successful grade", "Excellent"),
    ("Date", "07. 06. 2024"),
    ("Corresponding syllabus", "Not provided in the supplied materials."),
], '<div class="note">This EUGLOH Open University course is not included in the University of Szeged Albert Szent-Györgyi School of Medicine Curriculum 2025/2026 booklet. No syllabus was added, because it is not in the second document.</div>'))

html_parts.append("</body></html>")
OUT.write_text("".join(html_parts), encoding="utf-8")
print("Wrote", OUT, "bytes", OUT.stat().st_size)
