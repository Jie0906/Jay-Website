import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { getAllSkills, createSkill } from '../api/skillApi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLocation } from 'react-router-dom';
import Loading from '../components/common/Loading'

const SkillSection = ({ skill }) => {
    const { ref, inView } = useInView({ triggerOnce: true });

    return (
        <SkillItem ref={ref} style={{ opacity: inView ? 1 : 0.5, transform: inView ? 'scale(1)' : 'scale(0.9)' }}>
            <SkillDetails>
                <SkillTitle>{skill.title}</SkillTitle>
                <SkillSubtitle>{skill.subtitle}</SkillSubtitle>
                <SkillDescription dangerouslySetInnerHTML={{ __html: skill.content }} />
            </SkillDetails>
            {skill.imageUrl && (
                <SkillImageWrapper>
                    <SkillImage src={skill.imageUrl} alt={skill.title} />
                </SkillImageWrapper>
            )}
        </SkillItem>
    );
};

const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newSkill, setNewSkill] = useState({ title: '', subtitle: '', content: '' });
    const [file, setFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const location = useLocation(); // 使用 useLocation 鉤子

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const data = await getAllSkills();
                setSkills(data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSkill((prev) => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (content) => {
        setNewSkill((prev) => ({ ...prev, content }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('title', newSkill.title);
        formData.append('subtitle', newSkill.subtitle);
        formData.append('content', newSkill.content);
        if (file) {
            formData.append('image', file);
        }

        try {
            const createdSkill = await createSkill(formData);
            setSkills((prev) => [...prev, createdSkill]);
            setNewSkill({ title: '', subtitle: '', content: '' });
            setFile(null);
            setIsEditing(false);
        } catch (error) {
            setError(error);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <SkillsContainer>
            {skills.map((skill) => (
                <SkillSection key={skill._id} skill={skill} />
            ))}
            {location.pathname === '/admin' && ( // 僅在 /admin 路徑下顯示編輯器
                isEditing ? (
                    <EditorContainer>
                        <Input
                            type="text"
                            name="title"
                            value={newSkill.title}
                            onChange={handleInputChange}
                            placeholder="Title"
                        />
                        <Input
                            type="text"
                            name="subtitle"
                            value={newSkill.subtitle}
                            onChange={handleInputChange}
                            placeholder="Subtitle"
                        />
                        <ReactQuill value={newSkill.content} onChange={handleContentChange} />
                        <Input type="file" onChange={handleFileChange} />
                        <Button onClick={handleSave}>Save</Button>
                        <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                    </EditorContainer>
                ) : (
                    <Button onClick={() => setIsEditing(true)}>Add New Skill</Button>
                )
            )}
        </SkillsContainer>
    );
};

const SkillsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px;
    background-color: #fef5e7;
    min-height: 100vh;
    box-sizing: border-box;
`;

const SkillItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    margin-bottom: 40px;
    padding: 20px;
    background-color: #fffaf0;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
`;

const SkillDetails = styled.div`
    flex: 1;
`;

const SkillTitle = styled.h2`
    margin: 0;
    color: #8b5e3c;
`;

const SkillSubtitle = styled.h3`
    font-size: 1.2em;
    margin-bottom: 10px;
    color: grey;
`;

const SkillDescription = styled.div`
    color: #7a5533;
`;

const SkillImageWrapper = styled.div`
    flex: 0 0 200px;
    height: 200px;
    margin-left: 20px;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SkillImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const EditorContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 1200px;
    margin-bottom: 40px;
    padding: 20px;
    background-color: #fffaf0;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
    padding: 10px;
    margin-bottom: 10px;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Button = styled.button`
    padding: 10px 20px;
    margin: 5px;
    font-size: 1em;
    color: white;
    background-color: #8b5e3c;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #7a5533;
    }
`;

export default Skills;
