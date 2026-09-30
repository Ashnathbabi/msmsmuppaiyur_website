import React, {
    useEffect,
    useState
} from "react";


const API_URL =
    import.meta.env.VITE_API_URL ||
    "/api";


const IMAGE_URL =
    import.meta.env.VITE_IMAGE_URL ||
    "";


const AdminHomeAbout = () => {

    const [form, setForm] = useState({

        badge_text: "",
        title: "",
        description: "",
        experience_text: "",
        mission_text: "",

        futures_percentage: 96,
        futures_title: "",
        futures_description: "",

        growth_percentage: 97,
        growth_title: "",
        growth_description: "",

        button_text: "",
        button_link: ""

    });


    const [mainImage, setMainImage] =
        useState(null);

    const [rightImage1, setRightImage1] =
        useState(null);

    const [rightImage2, setRightImage2] =
        useState(null);


    const [previewMain, setPreviewMain] =
        useState("");

    const [previewRight1, setPreviewRight1] =
        useState("");

    const [previewRight2, setPreviewRight2] =
        useState("");


    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);


    // =====================================================
    // IMAGE URL
    // =====================================================

    const getImageUrl = (image) => {

        if (!image) {
            return "";
        }

        // Already full URL
        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        // Remove accidental leading slash
        const cleanImage =
            image.replace(/^\/+/, "");

        // If database contains uploads/about/...
        if (
            cleanImage.startsWith(
                "uploads/"
            )
        ) {

            return `${IMAGE_URL}/${cleanImage}`;

        }

        // Normal filename
        return `${IMAGE_URL}/uploads/about/${cleanImage}`;

    };


    // =====================================================
    // FETCH
    // =====================================================

    useEffect(() => {

        fetchAbout();

    }, []);


    const fetchAbout = async () => {

        try {

            setLoading(true);


            const response = await fetch(
                `${API_URL}/about-home`
            );


            if (!response.ok) {

                throw new Error(
                    `Server returned ${response.status}`
                );

            }


            const result =
                await response.json();


            if (
                result.success &&
                result.data
            ) {

                const data =
                    result.data;


                setForm({

                    badge_text:
                        data.badge_text || "",

                    title:
                        data.title || "",

                    description:
                        data.description || "",

                    experience_text:
                        data.experience_text || "",

                    mission_text:
                        data.mission_text || "",


                    futures_percentage:
                        data.futures_percentage ??
                        96,

                    futures_title:
                        data.futures_title || "",

                    futures_description:
                        data.futures_description ||
                        "",


                    growth_percentage:
                        data.growth_percentage ??
                        97,

                    growth_title:
                        data.growth_title || "",

                    growth_description:
                        data.growth_description ||
                        "",


                    button_text:
                        data.button_text || "",

                    button_link:
                        data.button_link || ""

                });


                setPreviewMain(
                    getImageUrl(
                        data.main_image
                    )
                );


                setPreviewRight1(
                    getImageUrl(
                        data.right_image_1
                    )
                );


                setPreviewRight2(
                    getImageUrl(
                        data.right_image_2
                    )
                );

            }


        } catch (error) {

            console.error(
                "FETCH ABOUT ERROR:",
                error
            );

            alert(
                "Unable to load About School"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // TEXT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm(
            previous => ({

                ...previous,

                [name]: value

            })
        );

    };


    // =====================================================
    // IMAGE CHANGE
    // =====================================================

    const handleImageChange = (
        e,
        setImage,
        setPreview
    ) => {

        const file =
            e.target.files?.[0];


        if (!file) {
            return;
        }


        setImage(file);


        const preview =
            URL.createObjectURL(file);


        setPreview(preview);

    };


    // =====================================================
    // SAVE
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (saving) {
            return;
        }


        setSaving(true);


        try {

            const formData =
                new FormData();


            Object.entries(form)
                .forEach(
                    ([key, value]) => {

                        formData.append(
                            key,
                            value ?? ""
                        );

                    }
                );


            if (mainImage) {

                formData.append(
                    "main_image",
                    mainImage
                );

            }


            if (rightImage1) {

                formData.append(
                    "right_image_1",
                    rightImage1
                );

            }


            if (rightImage2) {

                formData.append(
                    "right_image_2",
                    rightImage2
                );

            }


            const response =
                await fetch(

                    `${API_URL}/about-home`,

                    {

                        method: "PUT",

                        body: formData

                    }

                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Update failed"
                );

            }


            alert(
                "About School updated successfully"
            );


            // Clear selected files
            setMainImage(null);
            setRightImage1(null);
            setRightImage2(null);


            // Reload database data
            await fetchAbout();


        } catch (error) {

            console.error(
                "SAVE ERROR:",
                error
            );


            alert(
                error.message ||
                "Something went wrong"
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="
                flex
                items-center
                justify-center
                min-h-[400px]
                text-gray-500
            ">

                Loading About School...

            </div>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="
            w-full
            p-6
            bg-gray-50
            min-h-screen
        ">


            <div className="
                max-w-7xl
                mx-auto
                bg-white
                rounded-2xl
                shadow-sm
                border
                border-gray-100
            ">


                {/* HEADER */}

                <div className="
                    px-6
                    py-5
                    border-b
                    border-gray-100
                ">

                    <h2 className="
                        text-xl
                        font-semibold
                        text-gray-800
                    ">

                        About School

                    </h2>


                    <p className="
                        text-sm
                        text-gray-500
                        mt-1
                    ">

                        Manage the About School
                        section

                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="p-6"
                >


                    {/* BASIC CONTENT */}

                    <SectionTitle>
                        Basic Content
                    </SectionTitle>


                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-5
                    ">


                        <Input
                            label="Badge Text"
                            name="badge_text"
                            value={form.badge_text}
                            onChange={handleChange}
                        />


                        <Input
                            label="Experience Text"
                            name="experience_text"
                            value={
                                form.experience_text
                            }
                            onChange={handleChange}
                        />


                        <div className="md:col-span-2">

                            <TextArea
                                label="Main Heading"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                rows={2}
                            />

                        </div>


                        <div className="md:col-span-2">

                            <TextArea
                                label="Description"
                                name="description"
                                value={
                                    form.description
                                }
                                onChange={handleChange}
                                rows={4}
                            />

                        </div>


                        <div className="md:col-span-2">

                            <TextArea
                                label="Mission Content"
                                name="mission_text"
                                value={
                                    form.mission_text
                                }
                                onChange={handleChange}
                                rows={5}
                            />

                        </div>

                    </div>


                    <Divider />


                    {/* PROGRESS 1 */}

                    <SectionTitle>
                        First Progress Item
                    </SectionTitle>


                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-12
                        gap-5
                    ">


                        <div className="md:col-span-2">

                            <Input
                                label="Percentage"
                                type="number"
                                name="futures_percentage"
                                value={
                                    form.futures_percentage
                                }
                                onChange={handleChange}
                                min="0"
                                max="100"
                            />

                        </div>


                        <div className="md:col-span-4">

                            <Input
                                label="Title"
                                name="futures_title"
                                value={
                                    form.futures_title
                                }
                                onChange={handleChange}
                            />

                        </div>


                        <div className="md:col-span-6">

                            <Input
                                label="Description"
                                name="futures_description"
                                value={
                                    form.futures_description
                                }
                                onChange={handleChange}
                            />

                        </div>

                    </div>


                    {/* PROGRESS 2 */}

                    <SectionTitle>
                        Second Progress Item
                    </SectionTitle>


                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-12
                        gap-5
                    ">


                        <div className="md:col-span-2">

                            <Input
                                label="Percentage"
                                type="number"
                                name="growth_percentage"
                                value={
                                    form.growth_percentage
                                }
                                onChange={handleChange}
                                min="0"
                                max="100"
                            />

                        </div>


                        <div className="md:col-span-4">

                            <Input
                                label="Title"
                                name="growth_title"
                                value={
                                    form.growth_title
                                }
                                onChange={handleChange}
                            />

                        </div>


                        <div className="md:col-span-6">

                            <Input
                                label="Description"
                                name="growth_description"
                                value={
                                    form.growth_description
                                }
                                onChange={handleChange}
                            />

                        </div>

                    </div>


                    <Divider />


                    {/* IMAGES */}

                    <SectionTitle>
                        About Images
                    </SectionTitle>


                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-3
                        gap-6
                    ">


                        <ImageUpload
                            label="Main Image"
                            preview={previewMain}
                            onChange={(e) =>
                                handleImageChange(
                                    e,
                                    setMainImage,
                                    setPreviewMain
                                )
                            }
                        />


                        <ImageUpload
                            label="Right Image 1"
                            preview={
                                previewRight1
                            }
                            onChange={(e) =>
                                handleImageChange(
                                    e,
                                    setRightImage1,
                                    setPreviewRight1
                                )
                            }
                        />


                        <ImageUpload
                            label="Right Image 2"
                            preview={
                                previewRight2
                            }
                            onChange={(e) =>
                                handleImageChange(
                                    e,
                                    setRightImage2,
                                    setPreviewRight2
                                )
                            }
                        />

                    </div>


                    <Divider />


                    {/* BUTTON */}

                    <SectionTitle>
                        Button
                    </SectionTitle>


                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-5
                    ">


                        <Input
                            label="Button Text"
                            name="button_text"
                            value={
                                form.button_text
                            }
                            onChange={handleChange}
                        />


                        <Input
                            label="Button Link"
                            name="button_link"
                            value={
                                form.button_link
                            }
                            onChange={handleChange}
                            placeholder="/about"
                        />

                    </div>


                    {/* SAVE */}

                    <div className="
                        flex
                        justify-end
                        mt-8
                    ">

                        <button
                            type="submit"
                            disabled={saving}
                            className="
                                px-6
                                py-3
                                rounded-xl
                                bg-gray-900
                                text-white
                                text-sm
                                font-medium
                                hover:bg-gray-800
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >

                            {saving
                                ? "Saving..."
                                : "Save Changes"
                            }

                        </button>

                    </div>


                </form>

            </div>

        </div>

    );

};


// =====================================================
// INPUT
// =====================================================

const Input = ({
    label,
    ...props
}) => {

    return (

        <div>

            <label className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
            ">

                {label}

            </label>


            <input
                {...props}
                className="
                    w-full
                    px-4
                    py-3
                    border
                    border-gray-200
                    rounded-xl
                    text-sm
                    text-gray-800
                    outline-none
                    focus:ring-2
                    focus:ring-gray-200
                    focus:border-gray-400
                    transition
                "
            />

        </div>

    );

};


// =====================================================
// TEXT AREA
// =====================================================

const TextArea = ({
    label,
    ...props
}) => {

    return (

        <div>

            <label className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
            ">

                {label}

            </label>


            <textarea
                {...props}
                className="
                    w-full
                    px-4
                    py-3
                    border
                    border-gray-200
                    rounded-xl
                    text-sm
                    text-gray-800
                    outline-none
                    resize-y
                    focus:ring-2
                    focus:ring-gray-200
                    focus:border-gray-400
                    transition
                "
            />

        </div>

    );

};


// =====================================================
// SECTION TITLE
// =====================================================

const SectionTitle = ({
    children
}) => {

    return (

        <h3 className="
            text-base
            font-semibold
            text-gray-800
            mb-5
        ">

            {children}

        </h3>

    );

};


// =====================================================
// DIVIDER
// =====================================================

const Divider = () => (

    <div className="
        border-t
        border-gray-100
        my-8
    " />

);


// =====================================================
// IMAGE UPLOAD
// =====================================================

const ImageUpload = ({
    label,
    preview,
    onChange
}) => {

    return (

        <div>

            <label className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
            ">

                {label}

            </label>


            <input
                type="file"
                accept="image/*"
                onChange={onChange}
                className="
                    w-full
                    text-sm
                    text-gray-500
                    file:mr-4
                    file:py-2
                    file:px-4
                    file:rounded-lg
                    file:border-0
                    file:text-sm
                    file:font-medium
                    file:bg-gray-100
                    file:text-gray-700
                    hover:file:bg-gray-200
                    cursor-pointer
                "
            />


            <div className="
                mt-4
                h-48
                rounded-xl
                overflow-hidden
                border
                border-gray-100
                bg-gray-50
                flex
                items-center
                justify-center
            ">

                {preview ? (

                    <img
                        src={preview}
                        alt={label}
                        className="
                            w-full
                            h-full
                            object-cover
                        "
                    />

                ) : (

                    <span className="
                        text-sm
                        text-gray-400
                    ">

                        No image selected

                    </span>

                )}

            </div>

        </div>

    );

};


export default AdminHomeAbout;